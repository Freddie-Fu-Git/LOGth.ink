import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>('system')

  useEffect(() => {
    const stored = window.__theme?.getStoredTheme?.()
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      setTheme(stored)
    } else {
      setTheme('system')
    }
  }, [])

  const handleClick = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : prev === 'dark' ? 'system' : 'light'
      window.__theme?.setStoredTheme?.(next)
      window.__theme?.applyTheme?.(next)
      return next
    })
  }

  return (
    <button onClick={handleClick} className="relative size-5 flex items-center justify-center cursor-pointer" aria-label="切换主题">
      {theme === 'light' ? (
        <span className="icon-[tabler--sun-filled] size-5"></span>
      ) : theme === 'dark' ? (
        <span className="icon-[tabler--moon-filled] size-5"></span>
      ) : (
        <span className="icon-[tabler--device-desktop-question] size-5"></span>
      )}
    </button>
  )
}

export default ThemeToggle
