import mediaService from "@/lib/services/misc/media";
import { miscHandler } from "@/lib/utils/handler.utils";
import { successResponse } from "@/lib/utils/response.utils";
import { NextResponse } from "next/server";

// Scheduled pingers often only send HEAD, so all methods run the job

export const HEAD = miscHandler(async () => {
  const result = await mediaService.processStatus();
  const response = successResponse(result);
  return NextResponse.json(response);
});

export const GET = miscHandler(async () => {
  const result = await mediaService.processStatus();
  const response = successResponse(result);
  return NextResponse.json(response);
});

export const POST = miscHandler(async () => {
  const result = await mediaService.processStatus();
  const response = successResponse(result);
  return NextResponse.json(response);
});
