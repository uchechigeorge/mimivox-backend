import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://api.x.ai/v1";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const prompt = formData.get("prompt") as string;
    const files = formData.getAll("file") as File[];

    // Convert all files to base64 images
    let images: { type: string; url: string }[] = [];

    if (files && files.length > 0 && files[0]?.size > 0) {
      images = await Promise.all(
        files.map(async (file) => {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          return {
            type: "image_url",
            url: `data:${file.type};base64,${buffer.toString("base64")}`,
          };
        }),
      );
    }

    // Decide endpoint based on presence of images
    const endpoint =
      images.length > 0
        ? `${BASE_URL}/images/edits`
        : `${BASE_URL}/images/generations`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.XAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-imagine-image",
        prompt,
        ...(images.length > 0 && { images }),
        aspect_ratio: "3:2",
      }),
    });

    // Handle non-200 responses
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
      results: data?.data || [],
      raw: data,
    });
  } catch (error: any) {
    console.error("Image API Error:", error);

    return NextResponse.json(
      {
        error: "Image generation failed",
        message: error?.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}