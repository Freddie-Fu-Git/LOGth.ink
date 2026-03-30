export default function LanguageToggle() {
  const currentLang = typeof window !== 'undefined' ? (window.location.pathname.startsWith('/en') ? 'en' : 'zh-cn') : 'zh-cn'

  const toggleLanguage = () => {
    const nextLang = currentLang === 'en' ? 'zh-cn' : 'en'
    
    const pathname = window.location.pathname
    let newPathname = pathname

    if (nextLang === 'en') {
      newPathname = `/en${pathname}`
    } else {
      newPathname = pathname.replace(/^\/en/, '')
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
