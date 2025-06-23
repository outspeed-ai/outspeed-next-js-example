import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

import { env } from "@/app/config/env.server";

// Handle CORS preflight requests
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // change to the actual origin
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    // Get the session config from the request body
    const sessionConfig = await request.json();

    // Make request to Outspeed API
    const response = await axios.post("https://api.outspeed.com/v1/realtime/sessions", sessionConfig, {
      headers: {
        Authorization: `Bearer ${env.OUTSPEED_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    // Return the response from Outspeed API
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Token generation error:", error);

    // Handle axios errors specifically
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || "Failed to generate token";

      return NextResponse.json({ error: message }, { status });
    }

    // Handle other errors
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
