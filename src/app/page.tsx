"use client"

import { ArrowUpRight, Github, Linkedin, Mail, FileText, ExternalLink, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import createGlobe from 'cobe';
import { useEffect, useRef } from "react";
import { useSpring } from "@react-spring/web";
import { useTheme } from "@/hooks/useTheme";
import { KineticText } from "@/components/ui/kinetic-text"
import { AuroraText } from "#components/ui/aurora-text";


const projects = [
  { title: "Event-Driven Microservices", desc: "A distributed system built around independent services, async events and containerized deployments.", tags: ["Node.js", "Docker", "Kubernetes"], href: "https://github.com/dhatrishdixit/NodeMicroserviceTemplate", featured: true },
  { title: "ClipSync", desc: "A full-stack video platform with creators, subscriptions, playlists, comments and analytics.", tags: ["React", "Node.js", "MongoDB"], href: "https://github.com/dhatrishdixit/videoTubeBackend", featured: true },
  { title: "OAuth 2.0 & OpenID Connect", desc: "Authentication flows built from protocol fundamentals, including tokens, sessions and authorization.", tags: ["OAuth 2.0", "OIDC", "JWT"], href: "https://github.com/dhatrishdixit/OauthDemo", featured: true },
  { title: "Anonymous Messages", desc: "A focused full-stack app for anonymous message collection and sharing.", tags: ["Next.js", "Full Stack"], href: "https://github.com/dhatrishdixit/anonMsg" },
  { title: "Realtime Notifications", desc: "A small exploration of realtime communication and notification patterns.", tags: ["Next.js", "WebSockets"], href: "https://github.com/dhatrishdixit/realtime-notification-nextjs" },
  { title: "Video Streaming POC", desc: "A practical experiment with browser-friendly video streaming.", tags: ["Node.js", "Streaming"], href: "https://github.com/dhatrishdixit/video-streamingPOC" },
];

const skills = ["TypeScript", "JavaScript", "React", "Next.js", "Node.js", "Express", "MongoDB", "Prisma", "Docker", "Kubernetes", "C++", "SQL"];


export default function Home() {

  const {dark,toggleDark} = useTheme();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<{
     x:number,
     y:number
  } | null>(null);
  const isHold = useRef<boolean>(false);
  const dragStartRef = useRef<{
    r: number,
    theta: number
  }>({
    r:0,
    theta:0
  })
  const [{ r,t }, api] = useSpring(() => ({ r: 0,t:0 }));

 

 useEffect(() => {
  if (!canvasRef.current) return;



  const globe = createGlobe(canvasRef.current, {
    devicePixelRatio: 2,
    width: 100 * 2,
    height: 100 * 2,

    phi: 0,
    theta: 0.2,

    dark: 1,
    diffuse: 1.2,
    mapSamples: 16000,
    mapBrightness: 6,

    baseColor: [0.3, 0.3, 0.3],
    markerColor: [0.1, 0.8, 1],
    glowColor: [1, 1, 1],

    markers: [
      { location: [37.7595, -122.4367], size: 0.03 },
      { location: [40.7128, -74.006], size: 0.1 },
    ],
  });

  let phi = 0;
  let baseTheta = 0.2;
  let animationFrame: number;

  const animate = () => {
    if(!isHold.current) phi += 0.005;

    globe.update({
      phi: phi + r.get(),
      theta: baseTheta + t.get(),
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
          <a href="#top" className="font-semibold tracking-tight">dhatrish.dev</a>
          <div className="flex items-center gap-1">
            <nav className="hidden items-center gap-1 text-sm text-muted-foreground sm:flex">
              <a className="nav-link" href="#work">Work</a>
              <a className="nav-link" href="/blog">Blog</a>
              <a className="nav-link" href="#about">About</a>
            </nav>
                <Button variant="ghost" size="icon" onClick={toggleDark} aria-label="Toggle dark mode">
                   {!dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </Button>
          </div>
        </div>
      </header>

      <section id="top" className="relative overflow-hidden">
        <div className="absolute inset-0 grid-fade pointer-events-none" />
        <div className="container-x relative grid min-h-[78vh] items-center gap-16 py-24 lg:grid-cols-[1.1fr_.9fr]">
          <div className="animate-fade-up">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Software engineer · Bangalore</p>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.045em] sm:text-7xl">I build things for the <AuroraText>web.</AuroraText></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">I’m a software engineer who enjoys building full-stack products, exploring new technologies and understanding what happens under the hood.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="outline" asChild><a href="https://github.com/dhatrishdixit" target="_blank" rel="noreferrer">GitHub <Github className="ml-2 size-4" /></a></Button>
              <Button variant="ghost" asChild><a href="/blog">Read the blog <ArrowUpRight className="ml-2 size-4" /></a></Button>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <a href="mailto:dhatrish.dev@gmail.com" className="inline-flex items-center gap-2 hover:text-foreground"><Mail className="size-4" />Email</a>
              <a href="https://www.linkedin.com/in/dhatrishdixit/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-foreground"><Linkedin className="size-4" />LinkedIn</a>
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
                        console.log(deltaY)
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
                      console.log(e.pointerId,e.pointerType);
                    }}
                  />
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
                  <div><span className="text-xs text-muted-foreground/70">0{i + 1}</span><h3 className="mt-3 text-xl font-semibold tracking-tight">{p.title}</h3><p className="mt-3 max-w-2xl leading-7 text-muted-foreground">{p.desc}</p></div>
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
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end"><div><p className="eyebrow">Writing</p><h2 className="section-title mt-2">Notes from things I build.</h2></div><Button asChild><a href="/blog">Open blog <ArrowUpRight className="ml-2 size-4" /></a></Button></div>
          <p className="mt-5 max-w-xl leading-7 text-muted-foreground">Short technical notes on authentication, web development and experiments.</p>
        </div>
      </section>

      <footer className="border-t border-border/70 py-10"><div className="container-x flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><p>© 2026 Dhatrish Singh Dixit</p><div className="flex gap-5"><a className="hover:text-foreground" href="https://github.com/dhatrishdixit" target="_blank" rel="noreferrer">GitHub</a><a className="hover:text-foreground" href="https://www.linkedin.com/in/dhatrishdixit/" target="_blank" rel="noreferrer">LinkedIn</a><a className="hover:text-foreground" href="mailto:dhatrish.dev@gmail.com">Email</a></div></div></footer>
    </main>
  );
}
