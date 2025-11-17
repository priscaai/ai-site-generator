import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { ideia } = await req.json();

  return NextResponse.json({
    site: `Aqui está o site baseado na ideia: ${ideia}`,
  });
}
