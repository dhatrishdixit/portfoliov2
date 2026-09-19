import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import { redis } from './lib/redis';


export async function proxy(request: NextRequest,event:NextFetchEvent) {
  const userCountry = request.headers.get("x-vercel-ip-country");
  const isAlreadyCounted = request.cookies.get("visited")?.value;
  console.log(isAlreadyCounted);
  console.log(userCountry);
  const response = NextResponse.next();

  if(userCountry && isAlreadyCounted == undefined){
     event.waitUntil(redis.hincrby('visits_by_country',userCountry,1).catch(()=>{}));
     response.cookies.set('visited', '1', { maxAge: 60 * 60 * 24 })
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
