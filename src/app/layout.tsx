import type { Metadata } from "next";
import { ThemeProvider } from "@/hooks/useTheme";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dhatrish Singh Dixit — Software Engineer",
  description: "Software engineer building thoughtful products across the stack.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider storageKey="dark"  >{children}</ThemeProvider>
      </body>
    </html>
  );
}
