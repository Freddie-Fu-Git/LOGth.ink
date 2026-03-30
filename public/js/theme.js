;(function () {
  const STORAGE_KEY = 'theme'

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
  const root = document.documentElement

  function getStoredTheme() {
    try {
      const value = localStorage.getItem(STORAGE_KEY)
      return value || 'system'
    } catch {
      return 'system'
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {}
  }

  function getIsDark(theme) {
    return theme === 'dark' || (theme === 'system' && prefersDark.matches)
  }

  function applyTheme(theme) {
    const isDark = getIsDark(theme)

    root.classList.toggle('dark', isDark)

    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#09090b' : '#FFFFFF')
    }
  }

  window.__theme = {
    getStoredTheme,
    setStoredTheme,
    getIsDark,
    applyTheme,
  }

  const savedTheme = getStoredTheme()
  applyTheme(savedTheme)

  prefersDark.addEventListener('change', () => {
    if (getStoredTheme() === 'system') {
      applyTheme('system')
    }
  })

  document.addEventListener('astro:after-swap', () => {
    applyTheme(getStoredTheme())
  })
})()
