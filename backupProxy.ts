// proxy.ts (Next.js 16+)
// If using Next.js 15 or earlier, name this file middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
//import { redis } from './src/lib/redis';

// 1. The main execution function
export function proxy(request: NextRequest,response:NextResponse) {
  const userCountry = request.headers.get("x-vercel-ip-country");
  const isAlreadyCounted = request.cookies.get("visited")?.value;
  
  console.log(isAlreadyCounted);
  console.log('testing')

  if(!userCountry) return NextResponse.next()
    response.cookies.set('visited', '1', { maxAge: 60 * 60 * 24 })

  console.log(userCountry);

 // const countryCount:number|null = await redis.get(userCountry);
 // const newCount = countryCount == null ? 1 : countryCount + 1;

  //await redis.set(userCountry,newCount);
  // Continue with the original request lifecycle if conditions pass


  
  return NextResponse.next()
}

// 2. The Matcher Config
// Filters which paths this proxy function will execute on
export const config = {
 // matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  matcher: ["/:path*"]
}
