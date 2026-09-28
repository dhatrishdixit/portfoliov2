"use client"

import { ArrowUpRight, Github, Linkedin, Mail, FileText, ExternalLink, } from "lucide-react";
import { TbBrandLeetcode } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import createGlobe from 'cobe';
import { useEffect, useRef, useState } from "react";
import { useSpring } from "@react-spring/web";
import { useTheme } from "next-themes";
import { AuroraText } from "#components/ui/aurora-text";
import { AnimatedThemeToggler } from '../components/ui/animated-theme-toggler';
import InteractiveHoverButton from "#components/shadcn-space/button/button-19";
import LiveUserCount from "#components/live-user-count";
import { userPerCountry } from "#lib/actions";

const LIGHT_GLOBE = {
  dark: 0,
  diffuse:1.2,
  baseColor: [0.9, 0.9, 0.9] as [number, number, number],
  //markerColor: [0.25, 0.85, 0.75]  as [number, number, number],
  markerColor: [0.376, 0.376, 0.376] as [number,number,number],
  glowColor: [1, 1, 1] as [number, number, number],
};
const DARK_GLOBE = {
  dark: 1,
  diffuse:0.6,
  baseColor: [0.3, 0.3, 0.3] as [number, number, number],
  markerColor: [0.847, 0.847, 0.847] as [number, number, number],
  glowColor: [0.15, 0.15, 0.15]  as [number, number, number],
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpColor = (
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];

const projects = [
  { title: "ClipSync",   desc: "A full-stack video sharing platform inspired by modern creator ecosystems, built with React, Node.js, Express.js, and MongoDB. Features include secure authentication, video publishing and playback, search and recommendations, watch history, likes, comments, playlists, subscriptions, channel management, content sharing, and a creator dashboard with analytics. The backend exposes modular REST APIs with MongoDB aggregation pipelines, while Cloudinary powers media storage and email workflows handle account verification and password recovery.",
  tags: [
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "Cloudinary",
    "JWT"
  ],href: "https://clipsync.dhatrish.in/login", featured: true },
  { title: "Event-Driven Microservices",desc: "A production-style event-driven microservices architecture built with Node.js and Express.js, where independent Posts, Comments, Moderation, and Query services communicate asynchronously through a centralized event bus. The system demonstrates loose coupling and eventual consistency, with Docker containerization and Kubernetes orchestration managed through Skaffold. It also includes service synchronization, event propagation and replay patterns, ingress-based routing, and a React client for interacting with the distributed system.",
  tags: [
    "Node.js",
    "Express",
    "Microservices",
    "Docker",
    "Kubernetes",
    "Skaffold"
  ], href: "https://github.com/dhatrishdixit/NodeMicroserviceTemplate", featured: true },
  {   title: "OAuth 2.0 & OpenID Connect",
  desc: "A full-stack authentication platform built to understand and implement OAuth 2.0 and OpenID Connect from first principles. It supports credential-based and Google authentication, access and refresh token flows, secure HTTP-only cookie sessions, protected routes, role-based admin authorization, token refresh and logout, with a React frontend and TypeScript/Express backend backed by Prisma. The project also includes rate limiting, request validation and dedicated authentication, admin and health-check APIs.",
  tags: [
    "TypeScript",
    "OAuth 2.0",
    "OpenID Connect",
    "JWT",
    "Express",
    "Prisma"
  ], href: "https://oauth.fe.dhatrish.in/", featured: true },
  { title: "Realtime Notifications",   desc: "A full-stack real-time notification system built with Next.js, exploring event-driven updates and persistent user notifications. The project focuses on delivering updates to connected clients in real time while handling notification state, API communication, and the surrounding application flow in a modern Next.js architecture.",
  tags: [
    "Next.js",
    "WebSockets",
    "Realtime",
    "TypeScript"
  ], href: "https://github.com/dhatrishdixit/realtime-notification-nextjs" },
  { title: "Freelance work - Hospital Website",desc: "Freelance healthcare website built for a real hospital, with a responsive public site and custom Node.js admin dashboard for managing content, media and analytics.",tags: ["Node.js", "Express", "EJS"],href: "https://www.bilaspurhospital.com/",featured: true }
];

const skills = ["TypeScript", "JavaScript", "React", "Next.js", "Node.js", "Express", "MongoDB", "Prisma", "Docker", "Kubernetes", "C++", "SQL"];

type markerType = {
     location: [number,number],
     size: number,
     id:string,
}

type markerLabelType = {
     id: string,
     label:string,
     count: number,
}


export default function Home() {

  const {resolvedTheme,setTheme} = useTheme();
  const [markerLabel,setMarkerLabel] = useState<markerLabelType[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<{
     x:number,
     y:number
  } | null>(null);
  const isHold = useRef<boolean>(false);
  const markerRef = useRef<markerType[]>([]);
  const dragStartRef = useRef<{
    r: number,
    theta: number
  }>({
    r:0,
    theta:0
  })
  const [{ r,t,colorT }, api] = useSpring(() => ({ r: 0,t:0,colorT: resolvedTheme === "dark" ? 1 : 0,config: { duration: 400 } }));

  useEffect(()=>{
    if(markerLabel.length == 0) return;

    const css = markerLabel.map((_,i)=>
        `
        ::view-transition-group(label-${i}),
        ::view-transition-old(label-${i}),
        ::view-transition-new(label-${i}) {
          animation: none !important;
          mix-blend-mode: normal;
        }
    `
    ).join("\n");

    const styleEle = document.createElement("style");
    styleEle.textContent = css;
    document.head.appendChild(styleEle);

    return () => styleEle.remove()
  },[markerLabel]);

  useEffect(()=>{
     const markerUpdate = () => {
      const markerLabelArr:markerLabelType[] = [];
      userPerCountry().then((data)=>{
           markerRef.current = data.map((val)=> {
               markerLabelArr.push({
                id: val.country,
                label:`${val.country} : ${val.count} ${val.count > 1 ? "viewers" : "viewer"}`,
                count: val.count,
               })
               return {
                    id:val.country,
                    location:[val.lat,val.long],
                    size: 0.023,
               }
           }
          );
          setMarkerLabel(markerLabelArr);
          //console.log(markerLabelArr)
     }).catch(err => console.log(err))


     }

     markerUpdate();

     const onVisible = ()=>{
        if(document.visibilityState == "visible") markerUpdate();
     }

     document.addEventListener("visibilitychange",onVisible);

     return () => document.removeEventListener("visibilitychange",onVisible);

  },[]);
  
  useEffect(()=>{
    api.start({colorT:resolvedTheme === "dark" ? 1 : 0})
  },[resolvedTheme,api])


  useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  let width = canvas.offsetWidth;


  const globe = createGlobe(canvas, {
    devicePixelRatio: 2,
    width: width * 2,
    height: width * 2,

    phi: 0,
    theta: 0.2,

    dark: 1,
    diffuse: 1.2,
    mapSamples: 26000,
    mapBrightness: 6,

    baseColor: [0.3, 0.3, 0.3],
    markerColor: [0.1, 0.8, 1],
    glowColor: [0.3, 0.3, 0.3],

    markers: [
    ],
  });

  let phi = 0;
  let baseTheta = 0.2;
  let animationFrame: number;

  const animate = () => {
    if(!isHold.current) phi += 0.005;
    const mix = colorT.get();

    globe.update({
      width: width * 2,   
      height: width * 2,
      markers: markerRef.current,
      phi: phi + r.get(),
      theta: baseTheta + t.get(),
      dark: lerp(LIGHT_GLOBE.dark, DARK_GLOBE.dark, mix),
      markerElevation:0,
      diffuse:lerp(LIGHT_GLOBE.diffuse,DARK_GLOBE.diffuse,mix),
      baseColor: lerpColor(LIGHT_GLOBE.baseColor, DARK_GLOBE.baseColor, mix),
      markerColor: lerpColor(LIGHT_GLOBE.markerColor, DARK_GLOBE.markerColor, mix),
      glowColor: lerpColor(LIGHT_GLOBE.glowColor, DARK_GLOBE.glowColor, mix),
    });

    animationFrame = requestAnimationFrame(animate);
  };

  animate();

  return () => {
    cancelAnimationFrame(animationFrame);
    globe.destroy();
  };
}, []);
  return (
    <main>
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="container-x flex h-16 items-center justify-between">
          <a href="#top" className="font-semibold tracking-tight">dhatrish.in</a>
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-3 text-sm text-muted-foreground sm:flex">
              <a className="nav-link" href="#work">Work</a>
              <a className="nav-link" href="/blog">Blog</a>
              <a className="nav-link" href="#about">About</a>
            </nav>
                 <AnimatedThemeToggler
                    theme={resolvedTheme === "dark" ? "dark" : "light"}
                    onThemeChange={setTheme}
                 />
                 <LiveUserCount />
          </div>
        </div>
      </header>
     
      <section id="top" className="relative overflow-hidden">
        <div className="absolute inset-0 grid-fade pointer-events-none" />
        <div className="container-x relative grid min-h-[calc(100dvh-4rem)] items-center gap-10 pt-5.5 pb-17  sm:gap-16  lg:min-h-[calc(100svh-4rem)] 2xl:py-24 xl:grid-cols-[1.1fr_.9fr]">
          <div className="animate-fade-up">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Software engineer · Bangalore</p>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.045em] sm:text-7xl">I build things for the <AuroraText>web .</AuroraText></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">I’m a software engineer who enjoys building full-stack products, exploring new technologies and understanding what happens under the hood.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="outline" asChild><a href="https://github.com/dhatrishdixit" target="_blank" rel="noreferrer">GitHub <Github className="ml-2 size-4" /></a></Button>
              <Button variant="ghost" asChild><a href="/blog">Read the blog <ArrowUpRight className="ml-2 size-4" /></a></Button>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <a href="mailto:dhatrish.dev@gmail.com" className="inline-flex items-center gap-2 hover:text-foreground"><Mail className="size-4" />Email</a>
              <a href="https://www.linkedin.com/in/dhatrishdixit/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-foreground"><Linkedin className="size-4" />LinkedIn</a>
              <a href="https://leetcode.com/u/dhatrish29/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-foreground"><TbBrandLeetcode className="size-4" />LeetCode</a>   
              <a href="/blog" className="inline-flex items-center gap-2 hover:text-foreground"><FileText className="size-4" />Writing</a>
            </div>
          </div>
          
          <div>
            
                  <canvas
                    ref={canvasRef}
                    style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1, cursor: "pointer" }}
                    onPointerUp={()=>{
                      pointerRef.current = null;
                      isHold.current = false ; 
                    }}
                    onPointerCancel={()=>{
                      pointerRef.current = null;
                      isHold.current = false ; 
                    }}
                    onPointerMove={(e)=>{
                       if(pointerRef.current !== null){
                        const deltaX = e.clientX - pointerRef.current.x;
                        const deltaY = e.clientY - pointerRef.current.y;
                        //console.log(deltaY)
                       api.start({
                         r: dragStartRef?.current.r+deltaX/ 200,
                         t: Math.max(-1,Math.min(1, (dragStartRef?.current.theta+deltaY/ 250))),
                       })
                       } 
                    }}
                    onPointerDown={(e)=>{
                      pointerRef.current = {
                        x:e.clientX,
                        y:e.clientY
                      }
                      dragStartRef.current = {
                        r: r.get(),
                        theta: t.get()
                      };
                      isHold.current = true ; 
                      e.currentTarget.setPointerCapture(e.pointerId);
                      //console.log(e.pointerId,e.pointerType);
                    }}
                  />
                  {markerLabel.filter((m,i) => i < 10).map((m,i) => {
                    return (
                      <div
                        key={m.id}
                        className="marker-label"
                        style={{
                          positionAnchor: `--cobe-${m.id}`,
                          opacity: `var(--cobe-visible-${m.id}, 0)`,
                          viewTransitionName:`label-${i}`
                        }}
                      >
                        {m.label}
                      </div>
                    )
                  })}
          </div>
        </div>
      </section>

      <section id="work" className="border-t border-border/70 py-24">
        <div className="container-x">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div><p className="eyebrow">Selected work</p><h2 className="section-title">A few things I’ve built.</h2></div>
            <a className="hidden items-center gap-1 text-sm text-muted-foreground hover:text-foreground sm:flex" href="https://github.com/dhatrishdixit" target="_blank" rel="noreferrer">All repositories <ExternalLink className="size-4" /></a>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((p, i) => (
              <a key={p.title} href={p.href} target="_blank" rel="noreferrer" className={`project-card group ${p.featured && i === 0 ? "md:col-span-2" : ""}`}>
                <div className="flex items-start justify-between gap-6">
                  <div><span className="text-xs text-muted-foreground/70">0{i + 1}</span><h3 className="mt-3 text-xl font-semibold tracking-tight">{p.title}</h3><p className="mt-3 leading-7 text-muted-foreground">{p.desc}</p></div>
                  <ArrowUpRight className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-foreground" />
                </div>
                <div className="mt-6 flex flex-wrap gap-2">{p.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="border-y border-border/70 bg-card/60 py-24">
        <div className="container-x grid gap-12 md:grid-cols-[.8fr_1.2fr]">
          <div><p className="eyebrow">About</p><h2 className="section-title">Curious about the whole stack.</h2></div>
          <div>
            <p className="max-w-2xl leading-8 text-muted-foreground">I’m Dhatrish, a B.Tech Electrical Engineering graduate from NIT Raipur and an Analyst at Deloitte USI. I enjoy moving between interfaces, APIs, databases and infrastructure to turn ideas into working products.</p>
            <div className="mt-8 flex flex-wrap gap-2">{skills.map(skill => <span className="tag" key={skill}>{skill}</span>)}</div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-x rounded-2xl border border-border bg-card p-8 shadow-sm sm:p-12">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end"><div><p className="eyebrow">Writing</p><h2 className="section-title mt-2">Notes from things I build.</h2></div><InteractiveHoverButton className="mb-10 -ml-3"><a href="/blog">Open blog</a></InteractiveHoverButton></div>
          <p className="mt-5 max-w-xl leading-7 text-muted-foreground">Short technical notes on authentication, web development and experiments.</p>
        </div>
      </section>

      <footer className="border-t border-border/70 py-10"><div className="container-x flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><p>© 2026 Dhatrish Singh Dixit</p><div className="flex gap-5"><a className="hover:text-foreground" href="https://github.com/dhatrishdixit" target="_blank" rel="noreferrer">GitHub</a><a className="hover:text-foreground" href="https://www.linkedin.com/in/dhatrishdixit/" target="_blank" rel="noreferrer">LinkedIn</a><a className="hover:text-foreground" href="mailto:dhatrish.dev@gmail.com">Email</a></div></div></footer>
    </main>
  );
}
