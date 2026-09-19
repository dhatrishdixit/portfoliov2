"use server"

import { redis } from './redis';

export async function liveCount(){
    const now = Date.now();

    await redis.zadd("live_visitors_count",{
        score: now,
        member: crypto.randomUUID()
    })
    await redis.zremrangebyscore("live_visitors_count",0,now-30_000);
    return await redis.zcard("live_visitors_count");
}