import { env } from "@/lib/config/env.config";
import { UserAuthItems } from "@/lib/types";
import { uploadStreamToCloudinary } from "./upload";
import { createVoiceAndUpdateUser, validate } from "./clone.service";

export const cloneViaElevenLabs = async (
  formData: FormData,
  authItems: UserAuthItems,
) => {
  const data = Object.fromEntries(formData.entries());

  const user = await validate({ authItems });

  const url = `https://api.elevenlabs.io/v1/voices/add`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": env.ELEVENLABS_API_KEY,
    },
    body: formData,
  });

  const clonedRes = res.clone();

  if (!res.ok) {
    const clonedRes = res.clone();
    const errorText = await clonedRes.text();

    console.error("==> ERROR:", errorText);
    return res;
  }

  const elResponse = await clonedRes.json();

  const files = formData.getAll("files") as File[];
  const file = files[0];
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadResponse = await uploadStreamToCloudinary(buffer);

  await createVoiceAndUpdateUser({
    name: data.name.toString(),
    audioServiceType: "Google",
    user,
    voiceId: elResponse.voice_id,
    sampleUrl: uploadResponse.url,
    description: data.description.toString(),
  });

  return res;
};
