"use server"

import { ObjectSpaceNormalMap } from 'three';
import { redis } from './redis';

export async function liveCount(){
    try {
        const now = Date.now();

        await redis.zadd("live_visitors_count",{
            score: now,
            member: crypto.randomUUID()
        })
        await redis.zremrangebyscore("live_visitors_count",0,now-30_000);
        return await redis.zcard("live_visitors_count");
    } catch (error) {
        console.log(error instanceof Error ? error.message : String(error));
        return 0 ;
    }
}

export async function userPerCountry():Promise<Record<string, number>>{
   try {
       const counts = await redis.hgetall<Record<string, string|number>>("visits_by_country");
       if(!counts) return {};

       return Object.fromEntries(
           Object.entries(counts).map((country,count)=>[country,Number(count)])
       )
   } catch (error) {
        console.log(error instanceof Error ? error.message : String(error));
        return {} ;
   }
}