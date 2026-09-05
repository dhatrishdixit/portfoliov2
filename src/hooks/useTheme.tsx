"use client"

import * as React from "react";

type ThemeContextType = {
  dark: boolean;
  toggleDark: () => void;
}

type ThemeProviderProps = {
    children: React.ReactNode,
    storageKey:string,
}

const ThemeProviderContext = React.createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children,storageKey }: ThemeProviderProps) {
  
  const [dark,setDark] = React.useState(false);


  React.useEffect(() => {

    const saved = localStorage.getItem(storageKey);

    const isDark = saved == "true" ? true : ( saved == "false" ? false : window.matchMedia("(prefers-color-scheme: dark)").matches);

    localStorage.setItem(storageKey,isDark ? "true" : "false");
    setDark(isDark);

  }, []);

  React.useEffect(()=>{
    document.documentElement.classList.toggle("dark",dark);
  },[dark])
  
  const value = {
    dark
    ,toggleDark : function(){
        setDark(prev => {
          let next = !prev ;
          localStorage.setItem(storageKey,next? "true" : "false");
          return next ; 
        })

    }
  }


  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}


export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);

  if (context === null)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

