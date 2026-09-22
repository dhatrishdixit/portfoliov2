"use server"

import { ObjectSpaceNormalMap } from 'three';
import { redis } from './redis';
import { CENTROIDS } from './country-centroids';

export type VisitMarker = {
    country:string,
    lat:number,
    long:number,
    count:number
}

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

export async function userPerCountry():Promise<VisitMarker[]>{
   try {
       const counts = await redis.hgetall<Record<string, string|number>>("visits_by_country");
       if(!counts) return [];


       return Object.entries(counts).map(([country,count])=>{
           const centroid = CENTROIDS[country];
           if(!centroid) return null ; 
           const lat = CENTROIDS[country][0];
           const long = CENTROIDS[country][1];
           const parsedCount = Number(count);
           if(parsedCount <= 0) return null;

           return {
              country,
              lat,
              long,
              count:parsedCount
           }
       }).filter((marker)=>marker !== null)


   } catch (error) {
        console.log(error instanceof Error ? error.message : String(error));
        return [] ;
   }
}