"use client"

import React, { useEffect, useState } from 'react'
import { liveCount } from "../lib/actions" ;

function LiveUserCount() {
  
  const [liveUserCount,setLiveUserCount] = useState<number>(0);

  useEffect(()=>{
    const intervalId = setInterval(()=>{
        liveCount().then(setLiveUserCount).catch((err)=>console.log(err))
    },30_000)

    return () => {
      clearInterval(intervalId)
    }
  },[])

  if(liveUserCount == null) return null

  return (
    <div>
      <span className="text-sm text-muted-foreground">
        🟢 {liveUserCount} {liveUserCount === 1 ? "Person i.e. you ❤️" : "People"}
      </span>
    </div> 
  )
}

export default LiveUserCount ; 
