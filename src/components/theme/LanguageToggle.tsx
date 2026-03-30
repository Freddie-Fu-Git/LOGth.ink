export default function LanguageToggle() {
  const currentLang = typeof window !== 'undefined' ? (window.location.pathname.startsWith('/en') ? 'en' : 'zh-cn') : 'zh-cn'

  const toggleLanguage = () => {
    const nextLang = currentLang === 'en' ? 'zh-cn' : 'en'

    const pathname = window.location.pathname
    let newPathname = pathname

    const parts = pathname.split('/').filter(Boolean)
    const knownRoots = new Set(['about', 'posts', 'projects', 'photos', 'tags', '404'])
    const isEnArticle = parts.length === 2 && parts[0] === 'en' && !knownRoots.has(parts[1])
    const isZhArticle = parts.length === 1 && !knownRoots.has(parts[0])

    if (nextLang === 'en') {
      newPathname = isZhArticle ? '/en/' : `/en${pathname}`
    } else {
      newPathname = isEnArticle ? '/' : pathname.replace(/^\/en/, '')
    }

    if (newPathname === '') newPathname = '/'
    localStorage.setItem('preferred-lang', nextLang)
    window.location.href = newPathname
  }

  return (
    <div className="relative inline-flex">
      <button
        onClick={toggleLanguage}
        className="inline-flex items-center hover:scale-105 size-5 origin-center"
        aria-label="Toggle Language"
      >
        <span className="icon-[material-symbols--translate-rounded] size-5"></span>
      </button>
    </div>
  )
}
