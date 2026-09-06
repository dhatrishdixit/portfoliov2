import { ArrowLeft, ArrowUpRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

const posts = [
  { title: "OAuth 2.0 & OpenID Connect from the ground up", description: "Understanding authorization flows, tokens, sessions and the protocol decisions behind a working implementation.", href: "https://journal.dhatrish.in", date: "Technical writing" },
  { title: "JWTs, sessions and modern authentication architecture", description: "A practical look at token lifecycle management, protected routes and authorization boundaries.", href: "https://journal.dhatrish.in", date: "Technical writing" },
  { title: "Building authentication instead of hiding behind a library", description: "Lessons from implementing OAuth and OIDC flows directly to understand what authentication libraries abstract away.", href: "https://journal.dhatrish.in", date: "Technical writing" },
];

export default function BlogPage() {
  return <main className="min-h-screen">
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl"><div className="container-x flex h-16 items-center justify-between"><a href="/" className="font-semibold tracking-tight">dhatrish.dev</a><div className="flex items-center gap-1"><a className="nav-link hidden sm:inline-flex" href="/">Home</a>ThemeToggle</div></div></header>
    <section className="container-x py-24 sm:py-32">
      <Button variant="ghost" asChild className="mb-10 -ml-3"><a href="/"><ArrowLeft className="mr-2 size-4" />Back home</a></Button>
      <div className="max-w-3xl animate-fade-up"><p className="eyebrow">Journal</p><h1 className="mt-3 text-5xl font-semibold tracking-[-0.045em] sm:text-6xl">Things I’ve learned while building.</h1><p className="mt-6 text-lg leading-8 text-muted-foreground">Notes on authentication, backend engineering, distributed systems and the experiments behind my projects.</p></div>
      <div className="mt-16 max-w-4xl divide-y divide-border border-y border-border">
        {posts.map((post, i) => <a key={post.title} href={post.href} target="_blank" rel="noreferrer" className="blog-row group block py-8"><div className="flex gap-6"><span className="pt-1 text-xs text-muted-foreground/70">0{i + 1}</span><div className="flex-1"><div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><CalendarDays className="size-3.5" />{post.date}</div><h2 className="mt-3 text-2xl font-semibold tracking-tight group-hover:underline group-hover:underline-offset-4">{post.title}</h2><p className="mt-3 max-w-2xl leading-7 text-muted-foreground">{post.description}</p></div><ArrowUpRight className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-foreground" /></div></a>)}
      </div>
      <div className="mt-10"><Button asChild><a href="https://journal.dhatrish.in" target="_blank" rel="noreferrer">Visit journal <ArrowUpRight className="ml-2 size-4" /></a></Button></div>
    </section>
  </main>;
}
