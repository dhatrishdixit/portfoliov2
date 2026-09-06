import type { Metadata } from "next";
import { ThemeProvider } from "@/hooks/useTheme";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Dhatrish Singh Dixit — Software Engineer",
  description: "Software engineer building thoughtful products across the stack.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let storageKey = "dark";


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
        {
          `
            (function(){
              const saved = localStorage.getItem(${storageKey});
              const isDark = saved == "true" ? true : ( saved == "false" ? false : window.matchMedia("(prefers-color-scheme: dark)").matches);
              document.documentElement.classList.toggle("dark",isDark);
             })()
          `
        }
      </Script>
      </head>
         
      <body>
        <ThemeProvider storageKey={storageKey}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
