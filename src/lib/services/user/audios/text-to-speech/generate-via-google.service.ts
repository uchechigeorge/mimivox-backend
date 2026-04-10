import { env } from "@/lib/config/env.config";
import { UserAuthItems } from "@/lib/types";
import { createAudioAndUpdateUser, validate } from "./generate.service";
import { GoogleTTSSDto } from "@/lib/dtos/user/tts.dto";
import { uploadToCloudinary } from "./upload";
import voiceRepo from "@/lib/repositories/voice.repo";
import googleService from "@/lib/services/shared/google";
import { BadRequestError } from "@/lib/utils/error.util";

export const generateViaGoogle = async (
  body: GoogleTTSSDto,
  authItems: UserAuthItems,
) => {
  const content = body.input.text;
  // if (body.voice.name.includes("-")) {
  //   throw new BadRequestError("Invalid voice");
  // }
  const voiceNameArr = body.voice.name.split("-");
  const voiceId = voiceNameArr[voiceNameArr.length - 1];

  let [user, voice] = await validate({
    authItems,
    content,
    voiceId,
    audioServiceType: "Google",
  });

  console.log({ voiceId, voice, user });

  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${env.GOOGLE_API_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
  });

  const clonedRes = res.clone();
  if (!res.ok) {
    const errorText = await clonedRes.text();

    console.error("==> ERROR:", errorText);
    return res;
  }

  const result = await clonedRes.json();
  const base64String = result.audioContent;

  const uploadResult = await uploadToCloudinary(
    `data:audio/mp3;base64,${base64String}`,
  );
  // const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  // const blob = new Blob([bytes], { type: "audio/mpeg" });
  // return URL.createObjectURL(blob);

  if (!voice) {
    const sequence = await voiceRepo.getMaxSequence({ type: "Default" });

    const googleVoice = (await googleService.voice.listVoices()).voices.find(
      (e) => e.name === voiceId,
    );

    if (!googleVoice) {
      throw new BadRequestError("Google voice not found");
    }

    voice = await voiceRepo.create({
      audioServiceType: "Google",
      audioServiceReferenceId: googleVoice?.name,
      name: googleVoice.name,
      // description: googleVoice.description,
      gender: googleVoice.ssmlGender,
      // previewUrl: googleVoice.preview_url,
      sequence,
      type: "Default",
    });
    if (googleVoice) {
    }
  }

  await createAudioAndUpdateUser({
    user,
    content,
    audioUrl: uploadResult.url,
    voice,
    languageCode: body.voice.languageCode,
    requestLog: {
      url,
      body,
    },
  });

  return res;
};
