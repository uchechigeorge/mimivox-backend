import {
  VoiceCreateArgs,
  VoiceCreateManyArgs,
} from "@/generated/prisma/models";
import voiceRepo from "@/lib/repositories/voice.repo";
import elevenLabsService from "@/lib/services/shared/eleven-labs";
import googleService from "@/lib/services/shared/google";

export default async function seedVoices() {
  if (await voiceRepo.exists()) return;

  const googleVoices = (await googleService.getVoices()).voices.filter(
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

  // for (let i = 0; voices.length; i++) {

  //   voices[i].sequence = i + 1;
  // }

  await voiceRepo.createMany(voices);
}
