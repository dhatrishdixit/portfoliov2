// proxy.ts (Next.js 16+)
// If using Next.js 15 or earlier, name this file middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { redis } from './lib/redis';

// 1. The main execution function
export async function proxy(request: NextRequest) {
  const userCountry = request.headers.get("x-vercel-ip-country");

  if(!userCountry) return NextResponse.next()

  console.log(userCountry);

  const countryCount:number|null = await redis.get(userCountry);
  const newCount = countryCount == null ? 1 : countryCount + 1;

  await redis.set(userCountry,newCount);
  // Continue with the original request lifecycle if conditions pass
  
  return NextResponse.next()
}

// 2. The Matcher Config
// Filters which paths this proxy function will execute on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
