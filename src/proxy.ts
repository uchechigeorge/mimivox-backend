import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Retrieve the origin from the request headers
  const origin = request.headers.get("origin") || "";
  // const allowedOrigins = [
  //   "https://voice-maker-minivox-web.vercel.app",
  //   "http://localhost:4200",
  // ];

  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };

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
