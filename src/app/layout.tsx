import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { ThemeProvider } from '../components/theme-provider';

export const metadata: Metadata = {
  title: "Dhatrish Singh Dixit — Software Engineer",
  description: "Software engineer building thoughtful products across the stack.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let storageKey = "dark";


  return (
    <html lang="en" suppressHydrationWarning>
      <head /> 
      <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
