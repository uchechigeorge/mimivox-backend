import imageService from "@/lib/services/user/images";
import { userHandler } from "@/lib/utils/handler.utils";
import { getResponse } from "@/lib/utils/response.utils";
import { NextResponse } from "next/server";

export const GET = userHandler(async () => {
  const result = imageService.runway.listModels();

  return NextResponse.json(getResponse(result));
});
