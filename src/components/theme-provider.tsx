"use client";

import * as React from "react";

type ThemeContextType = {
  dark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  
  const [dark,setDark] = React.useState(false);


  React.useEffect(() => {

    const saved = localStorage.getItem("theme");
    const dark = saved === "dark";
    document.documentElement.classList.toggle("dark", dark);
    
  }, []);

  return <>{children}</>;
}
