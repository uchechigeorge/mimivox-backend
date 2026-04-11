import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://api.x.ai/v1";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing request id" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${BASE_URL}/videos/${id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.XAI_API_KEY}`,
        },
      }
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Status check failed" },
      { status: 500 }
    );
  }
}