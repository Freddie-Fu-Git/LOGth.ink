/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare global {
  interface Window {
    __theme?: {
      getStoredTheme?: () => 'light' | 'dark' | 'system'
      setStoredTheme?: (theme: 'light' | 'dark' | 'system') => void
      getIsDark?: (theme: 'light' | 'dark' | 'system') => boolean
      applyTheme?: (theme: 'light' | 'dark' | 'system') => void
      eventName?: string
    }
  }
}

export {}
