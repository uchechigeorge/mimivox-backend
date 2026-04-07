import { userHandler } from "@/lib/utils/handler.utils";
import { NextRequest, NextResponse } from "next/server";

export const POST = userHandler(async (req: NextRequest) => {
  return NextResponse.json({});
});
