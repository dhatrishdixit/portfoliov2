import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import { redis } from './lib/redis';


export async function proxy(request: NextRequest,event:NextFetchEvent) {
  //console.log("proxy hit")
  const userCountry = request.headers.get("x-vercel-ip-country") || "IN";
  const isAlreadyCounted = request.cookies.get("visited")?.value;
  const response = NextResponse.next();



  if(userCountry && isAlreadyCounted == undefined){
     event.waitUntil(redis.hincrby('visits_by_country_prod',userCountry,1).then(data => console.log(data)).catch(()=>{}));
     response.cookies.set('visited', '1', { maxAge: 60 * 60 * 24 })
  }
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
