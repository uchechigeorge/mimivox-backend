import { env } from "@/lib/config/env.config";
import { UserAuthItems } from "@/lib/types";
import { GoogleTTSDto } from "@/lib/dtos/user/tts.dto";
import voiceRepo from "@/lib/repositories/voice.repo";
import googleService from "@/lib/services/shared/google";
import { BadRequestError, UnauthorizedError } from "@/lib/utils/error.util";
import { uploadAudio } from "@/lib/utils/cloudinary.utils";
import { createAudio, reverseCredits, validate } from "../base.service";

export const generateSpeechFromText = async (
  body: GoogleTTSDto,
  authItems: UserAuthItems,
) => {
  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  const content = body.input.text;
  const voiceId = body.voice.name;

  let [user, voice] = await validate({
    userId,
    content,
    voiceId,
    audioServiceType: "Google",
  });

  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${env.GOOGLE_API_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
  });

  const clonedRes = res.clone();
  if (!res.ok) {
    await reverseCredits({ userId, content, audioServiceType: "Google" });
    const errorText = await clonedRes.text();

    console.error("==> ERROR:", errorText);
    return res;
  }

  const result = await clonedRes.json();
  const base64String = result.audioContent;

  const uploadResult = await uploadAudio(
    `data:audio/mp3;base64,${base64String}`,
    "tts-audio",
  );

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
      audioServiceReferenceId: googleVoice.name,
      name: googleVoice.name,
      gender: googleVoice.ssmlGender,
      sequence,
      type: "Default",
    });
    if (googleVoice) {
    }
  }

  await createAudio({
    user,
    content,
    audioUrl: uploadResult.secure_url,
    voice,
    languageCode: body.voice.languageCode,
    requestLog: {
      url,
      body,
    },
  });

  return res;
};
