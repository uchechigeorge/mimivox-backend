import runwayService from "@/lib/services/shared/runway";
import { UserAuthItems } from "@/lib/types";
import { BadRequestError, UnauthorizedError } from "@/lib/utils/error.util";

// Formats Runway accepts for generation inputs
const allowedExtensions: Record<string, "image" | "video" | "audio"> = {
  jpg: "image",
  jpeg: "image",
  png: "image",
  webp: "image",
  mp4: "video",
  mov: "video",
  mkv: "video",
  webm: "video",
  "3gp": "video",
  ogv: "video",
  mp3: "audio",
  wav: "audio",
  flac: "audio",
  m4a: "audio",
  aac: "audio",
};

const maxUploadBytes = 200 * 1024 * 1024;
const minUploadBytes = 512;

const getExtension = (filename: string) => {
  const extension = filename.split(".").pop()?.toLowerCase() ?? "";
  if (!allowedExtensions[extension]) {
    throw new BadRequestError(
      `Unsupported file type. Use ${Object.keys(allowedExtensions).join(", ")}`,
    );
  }

  return extension;
};

// Upload slot the browser posts the file to directly, so large videos never
// pass through our server
export const createUpload = async (
  body: { filename?: unknown },
  authItems: UserAuthItems,
) => {
  if (!authItems.userId) throw new UnauthorizedError();
  if (typeof body?.filename !== "string") {
    throw new BadRequestError("filename is required");
  }

  const extension = getExtension(body.filename);
  const upload = await runwayService.createUpload(
    `upload-${Date.now()}.${extension}`,
  );

  return {
    uploadUrl: upload.uploadUrl,
    fields: upload.fields,
    runwayUri: upload.runwayUri,
  };
};

// Fallback that uploads through our server; limited by the request body size
// the host allows
export const uploadFile = async (file: File, authItems: UserAuthItems) => {
  if (!authItems.userId) throw new UnauthorizedError();

  const extension = getExtension(file.name);
  if (file.size < minUploadBytes || file.size > maxUploadBytes) {
    throw new BadRequestError("Files must be between 512 bytes and 200MB");
  }

  const runwayUri = await runwayService.uploadFile(
    file,
    file.type,
    `upload-${Date.now()}.${extension}`,
  );

  return { runwayUri };
};
