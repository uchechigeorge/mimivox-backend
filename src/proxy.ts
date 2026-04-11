import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "./lib/config/env.config";

export function proxy(request: NextRequest) {
  // Retrieve the origin from the request headers
  const origin = request.headers.get("origin") || "";
  const allowedOrigins = env.ALLOWED_ORIGINS;

  const isAllowed = origin && allowedOrigins.includes(origin);

  // CORS headers
  let headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Credentials": "true",
  };
  if (isAllowed) {
    headers = {
      ...headers,
      "Access-Control-Allow-Origin": origin,
    };
  }

  // Handle preflight
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers,
    });
  }

  // Get the response
  const response = NextResponse.next();
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

// Configure which routes to apply proxy
export const config = {
  matcher: "/api/:path*", // Apply to all API routes
};
