import { UserAuthItems } from "@/lib/types";
import { userHandler } from "@/lib/utils/handler.utils";
import { AppRouteContext } from "@/lib/utils/types";
import { NextResponse } from "next/server";

export const POST = userHandler(
  async (req: Request, ctx: AppRouteContext<any>, authItems: UserAuthItems) => {
    try {
      const body = await req.json();

      const {
        mode,
        prompt,
        lyrics,
        style,
        title,
        instrumental,
        gender,
        customMode,
        callBackUrl,
      } = body;

      const response = await fetch("https://api.sunoapi.org/api/v1/generate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SUNO_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customMode: customMode ? customMode : false,
          instrumental: instrumental ?? false,
          model: "V4_5ALL",
          prompt: mode === "lyrics" ? lyrics : prompt,
          style,
          title: title || "AI Generated Song",
          negativeTags: "",
          vocalGender: gender ? gender : "m",
          styleWeight: 0.65,
          weirdnessConstraint: 0.65,
          audioWeight: 0.65,
          callBackUrl: callBackUrl
            ? callBackUrl
            : "https://api.example.com/callback",
        }),
      });

      const data = await response.json();

      return NextResponse.json({
        ...data,
      });
    } catch (err: any) {
      console.error(err);
      // return NextResponse.json({ error: "Generation failed" }, { status: 500 });
      return new Response(err, {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }
  },
  { authenticate: true },
);
