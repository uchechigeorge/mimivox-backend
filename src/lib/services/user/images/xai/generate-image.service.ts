import { env } from "@/lib/config/env.config";
import { XaiImageRequestBody, XaiImageResponse } from "./types";
import { UserAuthItems } from "@/lib/types";
import { reverseCredits, validate } from "../base.service";
import { createImages } from "./base.service";

export const generateImage = async (
  body: XaiImageRequestBody,
  authItems: UserAuthItems,
) => {
  const user = await validate({ prompt: body.prompt, authItems });
  // const prompt = formData.get("prompt") as string;
  // const files = formData.getAll("file") as File[];

  // const BASE_URL = "https://api.x.ai/v1";

  // // Convert all files to base64 images
  // let images: { type: string; url: string }[] = [];
  // if (files && files.length > 0 && files[0]?.size > 0) {
  //   images = await Promise.all(
  //     files.map(async (file) => {
  //       const bytes = await file.arrayBuffer();
  //       const buffer = Buffer.from(bytes);

  //       return {
  //         type: "image_url",
  //         url: `data:${file.type};base64,${buffer.toString("base64")}`,
  //       };
  //     }),
  //   );
  // }

  // // Decide endpoint based on presence of images
  // const endpoint =
  //   images.length > 0
  //     ? `${BASE_URL}/images/edits`
  //     : `${BASE_URL}/images/generations`;

  const url = `https://api.x.ai/v1/images/generations`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.XAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const clonedRes = res.clone();
  // Handle non-200 responses
  if (!res.ok) {
    const errorText = await clonedRes.text();
    console.log(errorText);

    await reverseCredits(authItems);
    return res;
  }

  const response = (await clonedRes.json()) as XaiImageResponse;

  await createImages(response, user, body.prompt, {
    url,
    body,
  });

  return res;
};
