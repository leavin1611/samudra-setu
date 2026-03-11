// src/app/api/genkit/route.ts

import { NextRequest, NextResponse } from "next/server";
import * as flows from "@/ai/dev";

export async function GET() {
  return NextResponse.json({
    message: "Genkit API is running",
    flows: Object.keys(flows)
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  return NextResponse.json({
    message: "POST received",
    data: body
  });
}