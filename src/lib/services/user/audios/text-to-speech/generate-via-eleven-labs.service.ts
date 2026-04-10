import { env } from "@/lib/config/env.config";
import { UserAuthItems } from "@/lib/types";
import { createAudioAndUpdateUser, validate } from "./generate.service";
import voiceRepo from "@/lib/repositories/voice.repo";
import elevenLabsService from "@/lib/services/shared/eleven-labs";
import { uploadStreamToCloudinary } from "./upload";

export const generateViaElevenLabs = async (
  voiceId: string,
  body: any,
  authItems: UserAuthItems,
) => {
  const content = body.text;
  let [user, voice] = await validate({
    authItems,
    content,
    voiceId,
    audioServiceType: "ElevenLabs",
  });

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": env.ELEVENLABS_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const clonedRes = res.clone();

  if (!res.ok) {
    const clonedRes = res.clone();
    const errorText = await clonedRes.text();

    console.error("==> ERROR:", errorText);
    return res;
  }

  const arrayBuffer = await clonedRes.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadedResult: any = await uploadStreamToCloudinary(buffer);

  if (!voice) {
    const sequence = await voiceRepo.getMaxSequence({ type: "Default" });

    const elVoice = await elevenLabsService.voice.getVoice(voiceId);
    voice = await voiceRepo.create({
      audioServiceType: "ElevenLabs",
      audioServiceReferenceId: elVoice.voice_id,
      name: elVoice.name,
      description: elVoice.description,
      gender: elVoice.labels?.gender,
      previewUrl: elVoice.preview_url,
      sequence,
      type: elVoice.category === "cloned" ? "Cloned" : "Default",
    });
  }

  await createAudioAndUpdateUser({
    user,
    content,
    audioUrl: uploadedResult.url,
    voice,
    languageCode: body.language_code,
    requestLog: {
      url,
      body,
    },
  });

  return res;
};
