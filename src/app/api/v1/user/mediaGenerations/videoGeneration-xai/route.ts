import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://api.x.ai/v1";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const prompt = formData.get("prompt") as string;
    const durationValue = formData.get("duration") as string; // ✅ fixed
    const files = formData.getAll("file") as File[];

    let base64Images: string[] = [];

    // Convert all files to base64
    if (files && files.length > 0 && files[0]?.size > 0) {
      base64Images = await Promise.all(
        files.map(async (file) => {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          return `data:${file.type};base64,${buffer.toString("base64")}`;
        }),
      );
    }

    // Build request body dynamically
    const body: any = {
      model: "grok-imagine-video",
      prompt,
      duration: durationValue ? Number(durationValue) : 10,
    };

    // 🔥 Conditional logic
    if (base64Images.length === 1) {
      body.image = {
        url: base64Images[0],
      };
    }

    if (base64Images.length > 1) {
      body.reference_images = base64Images.map((img) => ({
        url: img,
      }));
    }

    const response = await fetch(`${BASE_URL}/videos/generations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.XAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Handle API errors properly
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: "XAI API Error",
          details: errorText,
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      requestId: data.request_id,
      raw: data,
    });
  } catch (err: any) {
    console.error("Video API Error:", err);

    return NextResponse.json(
      {
        error: "Video start failed",
        message: err?.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}