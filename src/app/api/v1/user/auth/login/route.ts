import authService from "@/lib/services/user/auth";
import { userHandler } from "@/lib/utils/handler";
import { successResponse } from "@/lib/utils/response";
import { loginValidator } from "@/lib/validators/user/auth.validator";
import { NextResponse } from "next/server";

export const POST = userHandler(async (req: Request) => {
  const body = await req.json();
  const dto = loginValidator.parse(body);

  const result = await authService.login(dto);
  const response = successResponse(result);
  return NextResponse.json(response, {
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:4200",
      "Access-Control-Allow-Credentials": "true",
    },
  });
});

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:4200",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}
