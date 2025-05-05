"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Add a class to the document element based on the current theme
  React.useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    const handleThemeChange = () => {
      const isDark = document.documentElement.classList.contains('dark');
      
      // Apply appropriate Bootstrap classes based on theme
      if (isDark) {
        document.body.classList.add('bg-dark', 'text-white');
        document.body.classList.remove('bg-light', 'text-dark');
        
        // Apply dark theme to Bootstrap components
        document.querySelectorAll('.card:not(.bg-primary):not(.bg-success):not(.bg-info):not(.bg-warning)')
          .forEach((el) => {
            el.classList.add('bg-dark', 'border-secondary');
            el.classList.remove('bg-white', 'border-light');
          });
        
        // Apply dark theme to buttons
        document.querySelectorAll('.btn-outline-light')
          .forEach((el) => {
            if (!el.classList.contains('btn-gradient')) {
              el.classList.add('border-secondary');
            }
          });
      } else {
        document.body.classList.add('bg-light', 'text-dark');
        document.body.classList.remove('bg-dark', 'text-white');
        
        // Apply light theme to Bootstrap components
        document.querySelectorAll('.card:not(.bg-primary):not(.bg-success):not(.bg-info):not(.bg-warning)')
          .forEach((el) => {
            el.classList.remove('bg-dark', 'border-secondary');
            el.classList.add('bg-white', 'border-light');
          });
        
        // Apply light theme to buttons
        document.querySelectorAll('.btn-outline-light')
          .forEach((el) => {
            if (!el.classList.contains('btn-gradient')) {
              el.classList.remove('border-secondary');
            }
          });
      }
      
      // Dispatch a custom event for other components to react to
      window.dispatchEvent(new CustomEvent('themeChanged', { 
        detail: { isDark } 
      }));
    };
    
    // Initial theme setup with a slight delay to ensure DOM is fully loaded
    setTimeout(handleThemeChange, 0);
    
    // Listen for theme changes from next-themes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          handleThemeChange();
        }
      });
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
