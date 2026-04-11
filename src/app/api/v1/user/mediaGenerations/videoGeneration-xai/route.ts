import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://api.x.ai/v1";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const prompt = formData.get("prompt") as string;
    const file = formData.get("file") as File | null;

    let base64Image: string | null = null;

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;
    }

    const response = await fetch(`${BASE_URL}/videos/generations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.XAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-imagine-video",
        prompt: base64Image
          ? {
              image: base64Image,
              text: prompt,
            }
          : prompt,
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      requestId: data.request_id,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Video start failed" },
      { status: 500 }
    );
  }
}