import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const response = await fetch(
      `https://api.sunoapi.org/api/v1/generate/record-info?taskId=${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.SUNO_API_KEY}`,
        },
      },
    );

    const data = await response.json();

    return NextResponse.json({ ...data });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Status check failed" }, { status: 500 });
  }
}
