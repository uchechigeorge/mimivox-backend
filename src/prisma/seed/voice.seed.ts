import {
  VoiceCreateArgs,
  VoiceCreateManyArgs,
} from "@/generated/prisma/models";
import { prisma } from "@/lib/db/prisma";
import elevenLabsService from "@/lib/services/shared/eleven-labs";
import googleService from "@/lib/services/shared/google";

export default async function seedVoices() {
  const googleVoices = (await googleService.voice.listVoices()).voices.filter(
    (e) => !e.name.includes("-"),
  );

  const elevenLabVoices = (
    await elevenLabsService.voice.listVoices({
      page_size: 100,
      category: "premade",
    })
  ).voices.filter((e) => e.category == "premade");

  const voices: VoiceCreateManyArgs["data"] = [
    ...googleVoices.map<VoiceCreateArgs["data"]>((e) => {
      return {
        name: e.name,
        audioServiceType: "Google",
        audioServiceReferenceId: e.name,
        type: "Default",
        gender: e.ssmlGender.toLowerCase(),
        // description: e.naturalSampleRateHertz,
      };
    }),
    ...elevenLabVoices.map<VoiceCreateArgs["data"]>((e) => {
      return {
        name: e.name,
        audioServiceType: "ElevenLabs",
        audioServiceReferenceId: e.voice_id,
        type: "Default",
        gender: e.labels.gender.toLowerCase(),
        description: e.description,
      };
    }),
  ];

  voices.forEach((e, i) => {
    e.sequence = i + 1;
  });

  for (let i = 0; i < voices.length; i++) {
    const voice = voices[i];

    const audioServiceReferenceId = voice.audioServiceReferenceId;
    const audioServiceType = voice.audioServiceType;

    if (!audioServiceReferenceId) continue;

    await prisma.voice.upsert({
      where: {
        audioServiceType_audioServiceReferenceId: {
          audioServiceReferenceId,
          audioServiceType,
        },
      },
      create: voice,
      update: voice,
    });
  }
}
