import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_request: NextRequest) {
  // TODO: Implement forgot PIN functionality
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
