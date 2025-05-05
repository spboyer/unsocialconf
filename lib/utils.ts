import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { type ClassValue } from "clsx"

/**
 * Merges tailwind classes and cleans them to avoid conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Determines if the current theme is dark
 */
export function isDarkTheme(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

/**
 * Converts Bootstrap color names to Tailwind color classes
 */
export function bootstrapToTailwind(bootstrapColor: string, type: 'text' | 'bg' | 'border' = 'bg'): string {
  const mapping: Record<string, string> = {
    primary: 'primary',
    secondary: 'secondary',
    success: 'green-600',
    danger: 'red-600',
    warning: 'yellow-500',
    info: 'blue-400',
    light: 'gray-100',
    dark: 'gray-800'
  };

  const colorClass = mapping[bootstrapColor] || bootstrapColor;
  return `${type}-${colorClass}`;
}

/**
 * Converts Tailwind breakpoints to Bootstrap breakpoints
 */
export function tailwindToBootstrapBreakpoint(breakpoint: string): string {
  const mapping: Record<string, string> = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
    '2xl': 'xxl'
  };

  return mapping[breakpoint] || breakpoint;
}