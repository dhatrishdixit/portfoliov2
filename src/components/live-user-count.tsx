"use client"

import React, { useEffect, useState } from 'react'
import { liveCount } from "../lib/actions" ;

function LiveUserCount() {
  
  const [liveUserCount,setLiveUserCount] = useState<number>(0);

  useEffect(()=>{

    const func = () => {
        return liveCount().then(setLiveUserCount).catch((err)=>console.log(err));
    }

    func();
    const intervalId = setInterval(()=>{
        func();
    },30_000)

    return () => {
      clearInterval(intervalId)
    }
  },[])

  if(liveUserCount == null) return null

  return (
    <div>
      <span className="text-sm text-muted-foreground flex items-center gap-2.5">
        <div className="blinking-live-counter" /><span className="py-[10.4px]">
          {liveUserCount} {liveUserCount === 1 ? "Person" : "People"}
        </span>
      </span>
    </div> 
  )
}

export default LiveUserCount ; 
