// proxy.ts (Next.js 16+)
// If using Next.js 15 or earlier, name this file middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { redis } from './lib/redis';

// 1. The main execution function
export function proxy(request: NextRequest) {
  const userCountry = request.headers.get("x-vercel-ip-country");

  console.log(userCountry);
  


  // Continue with the original request lifecycle if conditions pass
  return NextResponse.next()
}

// 2. The Matcher Config
// Filters which paths this proxy function will execute on
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/api/secure-route/:path*'
  ],
}
