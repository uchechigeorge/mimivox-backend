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

    const response = await fetch(`${BASE_URL}/images/generations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.XAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-imagine-image",
        prompt,
        image_urls: base64Image ? [base64Image] : [],
        aspect_ratio: "3:2",
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      results: data.data || [],
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Image generation failed" },
      { status: 500 }
    );
  }
}