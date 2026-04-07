import { userHandler } from "@/lib/utils/handler.utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = userHandler(async (req: NextRequest) => {
  return NextResponse.json({});
});
