import { env } from "@/lib/config/env.config";
import * as cloudinaryUtils from "./cloudinary.utils";

/** Provider-agnostic upload result; `secure_url` mirrors Cloudinary's field. */
export type UploadResult = {
  url: string;
  secure_url: string;
  public_id: string;
};

export type UploadOptions = {
  resource_type?: "image" | "video" | "raw" | "auto";
  format?: string;
};

const MIME_BY_FORMAT: Record<string, string> = {
  mp3: "audio/mpeg",
  mp4: "video/mp4",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
};

const EXT_BY_MIME: Record<string, string> = {
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "video/mp4": "mp4",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

const isCustom = () => env.UPLOAD_PROVIDER === "custom";

/** Resolves a remote URL, data URI or Buffer into bytes + content type. */
const resolveSource = async (
  source: string | Buffer,
  format?: string,
): Promise<{ bytes: Buffer; contentType: string }> => {
  const fallbackType = (format && MIME_BY_FORMAT[format]) || "";

  if (Buffer.isBuffer(source)) {
    return {
      bytes: source,
      contentType: fallbackType || "application/octet-stream",
    };
  }

  const dataUri = /^data:([^;,]+)?(;base64)?,([\s\S]*)$/.exec(source);
  if (dataUri) {
    const [, type, isBase64, payload] = dataUri;
    return {
      bytes: isBase64
        ? Buffer.from(payload, "base64")
        : Buffer.from(decodeURIComponent(payload)),
      contentType: type || fallbackType || "application/octet-stream",
    };
  }

  const res = await fetch(source);
  if (!res.ok) {
    throw new Error(`Failed to fetch source file (${res.status}): ${source}`);
  }

  return {
    bytes: Buffer.from(await res.arrayBuffer()),
    contentType:
      res.headers.get("content-type")?.split(";")[0] ||
      fallbackType ||
      "application/octet-stream",
  };
};

const customUpload = async (
  source: string | Buffer,
  folder: string,
  options?: UploadOptions,
): Promise<UploadResult> => {
  const { bytes, contentType } = await resolveSource(source, options?.format);
  const ext = options?.format ?? EXT_BY_MIME[contentType] ?? "bin";

  const form = new FormData();
  form.append(
    "file",
    new Blob([new Uint8Array(bytes)], { type: contentType }),
    `upload.${ext}`,
  );
  form.append("folder", `mimivox/${folder}`);

  const res = await fetch(env.CUSTOM_UPLOAD_URL!, {
    method: "POST",
    headers: { "X-Api-Key": env.CUSTOM_UPLOAD_KEY! },
    body: form,
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Custom upload failed (${res.status}): ${text}`);
  }

  const data = JSON.parse(text) as {
    secure_url?: string;
    url?: string;
    public_id?: string;
  };
  const url = data.secure_url ?? data.url;
  if (!url) throw new Error(`Custom upload returned no url: ${text}`);

  return { url, secure_url: url, public_id: data.public_id ?? url };
};

export const uploadAudioStream = async (
  buffer: Buffer,
  folder: string,
): Promise<UploadResult> =>
  isCustom()
    ? customUpload(buffer, folder, { resource_type: "video", format: "mp3" })
    : cloudinaryUtils.uploadAudioStream(buffer, folder);

export const uploadAudio = async (
  file: string,
  folder: string,
): Promise<UploadResult> =>
  isCustom()
    ? customUpload(file, folder, { resource_type: "video", format: "mp3" })
    : cloudinaryUtils.uploadAudio(file, folder);

export const uploadVideo = async (
  file: string,
  folder: string,
): Promise<UploadResult> =>
  isCustom()
    ? customUpload(file, folder, { resource_type: "video", format: "mp4" })
    : cloudinaryUtils.uploadVideo(file, folder);

export const upload = async (
  file: string,
  folder: string,
  options?: UploadOptions,
): Promise<UploadResult> =>
  isCustom()
    ? customUpload(file, folder, options)
    : cloudinaryUtils.upload(file, folder, options);
