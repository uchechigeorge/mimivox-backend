import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ FIX

    const response = await fetch(
      `https://api.sunoapi.org/api/v1/generate/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.SUNO_API_KEY}`,
        },
      }
    );

    const data = await response.json();

    return NextResponse.json({ ...data, statusId: "dldlld" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Status check failed" },
      { status: 500 }
    );
  }
}