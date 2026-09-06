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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('dark') || 'system';
                  const isDark = theme === 'dark' || 
                    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  document.documentElement.classList.toggle('dark', isDark);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
         
      <body>
        <ThemeProvider storageKey={storageKey}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
