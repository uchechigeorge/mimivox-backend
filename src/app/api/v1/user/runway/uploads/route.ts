import runwayUserService from "@/lib/services/user/runway";
import { UserAuthItems } from "@/lib/types";
import { BadRequestError } from "@/lib/utils/error.util";
import { userHandler } from "@/lib/utils/handler.utils";
import { successResponse } from "@/lib/utils/response.utils";
import { NextRequest, NextResponse } from "next/server";

// JSON { filename } -> upload slot for a direct browser upload
// multipart { file } -> uploads through our server and returns the runway:// uri
export const POST = userHandler(
  async (req: NextRequest, ctx: unknown, authItems: UserAuthItems) => {
    const contentType = req.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file");
      if (!(file instanceof File))
        throw new BadRequestError("file is required");

      const result = await runwayUserService.uploadFile(file, authItems);
      return NextResponse.json(successResponse(result));
    }

    const body = await req.json();
    const result = await runwayUserService.createUpload(body, authItems);

    return NextResponse.json(successResponse(result));
  },
  { authenticate: true },
);
