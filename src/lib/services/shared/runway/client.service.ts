import { env } from "@/lib/config/env.config";
import { BadRequestError } from "@/lib/utils/error.util";
import {
  RunwayErrorResponse,
  RunwayTask,
  RunwayTaskCreateResponse,
  RunwayUploadResponse,
} from "./types";

const RUNWAY_VERSION = "2024-11-06";

const getHeaders = () => {
  if (!env.RUNWAY_API_KEY) {
    throw new BadRequestError("Runway is not configured");
  }

  return {
    Authorization: `Bearer ${env.RUNWAY_API_KEY}`,
    "X-Runway-Version": RUNWAY_VERSION,
    "Content-Type": "application/json",
  };
};

const getErrorMessage = async (res: Response) => {
  const text = await res.text();
  console.error(text);

  try {
    const error = JSON.parse(text) as RunwayErrorResponse;
    return error.error || "Runway request failed";
  } catch {
    return "Runway request failed";
  }
};

export const createTask = async (
  endpoint: "text_to_video" | "image_to_video" | "text_to_image",
  body: Record<string, unknown>,
) => {
  const res = await fetch(`${env.RUNWAY_API_BASE}/${endpoint}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new BadRequestError(await getErrorMessage(res));
  }

  return (await res.json()) as RunwayTaskCreateResponse;
};

export const getTask = async (id: string) => {
  const res = await fetch(`${env.RUNWAY_API_BASE}/tasks/${id}`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!res.ok) {
    throw new BadRequestError(await getErrorMessage(res));
  }

  return (await res.json()) as RunwayTask;
};

const parseDataUri = (dataUri: string) => {
  const match = /^data:([^;,]+)(;base64)?,([\s\S]*)$/.exec(dataUri);
  if (!match) throw new BadRequestError("Invalid media data");

  const [, mimeType, isBase64, data] = match;
  const buffer = isBase64
    ? Buffer.from(data, "base64")
    : Buffer.from(decodeURIComponent(data));

  return { mimeType, buffer };
};

// Reserves an ephemeral upload slot. The file must then be POSTed to
// uploadUrl with `fields` plus a `file` field; the runway:// uri lasts 24 hours.
export const createUpload = async (filename: string) => {
  const res = await fetch(`${env.RUNWAY_API_BASE}/uploads`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ filename, type: "ephemeral" }),
  });

  if (!res.ok) {
    throw new BadRequestError(await getErrorMessage(res));
  }

  return (await res.json()) as RunwayUploadResponse;
};

// Uploads a file to ephemeral storage and returns its runway:// uri
export const uploadFile = async (
  data: Blob | Buffer,
  mimeType: string,
  filename: string,
) => {
  const upload = await createUpload(filename);

  const form = new FormData();
  Object.entries(upload.fields).forEach(([key, value]) =>
    form.append(key, value),
  );
  form.append(
    "file",
    data instanceof Blob
      ? data
      : new Blob([new Uint8Array(data)], { type: mimeType }),
    filename,
  );

  const uploadRes = await fetch(upload.uploadUrl, {
    method: "POST",
    body: form,
  });

  if (!uploadRes.ok) {
    console.error(await uploadRes.text());
    throw new BadRequestError("Could not upload file");
  }

  return upload.runwayUri;
};

// Uploads a data URI to ephemeral storage and returns its runway:// uri
export const uploadDataUri = async (dataUri: string) => {
  const { mimeType, buffer } = parseDataUri(dataUri);
  const extension = mimeType.split("/")[1]?.split("+")[0] || "bin";

  return await uploadFile(
    buffer,
    mimeType,
    `upload-${Date.now()}.${extension}`,
  );
};

// Accepts an https url, runway:// uri or data uri and returns a uri Runway can read
export const resolveMediaUri = async (input: string) => {
  if (input.startsWith("data:")) return await uploadDataUri(input);
  if (input.startsWith("https://") || input.startsWith("runway://")) {
    return input;
  }

  throw new BadRequestError(
    "Media must be https urls, runway:// uris or data uris",
  );
};
