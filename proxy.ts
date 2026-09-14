import type { NextRequest, NextResponse } from "next/server";

export default function proxy(request: NextRequest,response:NextResponse) {
  
  response.cookies.set('visited', '1', { maxAge: 60 * 60 * 24 })

  return new Response("🔥 PROXY IS WORKING", {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

export const config = {
  matcher: ["/:path*"],
};