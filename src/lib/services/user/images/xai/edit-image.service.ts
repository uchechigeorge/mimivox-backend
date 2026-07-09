import { env } from "@/lib/config/env.config";
import { XaiImageRequestBody, XaiImageResponse } from "./types";
import { UserAuthItems } from "@/lib/types";
import { reverseCredits, validate } from "../base.service";
import { createImages } from "./base.service";

export const editImage = async (
  body: XaiImageRequestBody,
  authItems: UserAuthItems,
) => {
  const user = await validate({ prompt: body.prompt, authItems });

  const url = `https://api.x.ai/v1/images/edits`;
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
    console.error(errorText);

    await reverseCredits(authItems);
    return res;
  }

  const response = (await clonedRes.json()) as XaiImageResponse;

  const images = await createImages(response, user, body.prompt, {
    url,
    body,
  });

  // Replace url with our saved resource
  response.data.forEach((e) => {
    e.url = images.find((e) => e.altUrl)?.url ?? "";
  });

  const headers = new Headers(res.headers);

  // header cleanup
  headers.delete("content-encoding");
  headers.delete("transfer-encoding");

  return new Response(JSON.stringify(response), {
    status: res.status,
    headers,
  });
};
