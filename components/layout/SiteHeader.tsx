import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useGlobalUX } from '@/components/providers/GlobalUXProvider'
import { Sun, Moon, Languages } from 'lucide-react'
import { getArabicServiceForEnglishSlug, getEnglishServiceForArabicSlug } from '@/lib/seo-services'

export default function SiteHeader() {
  const router = useRouter()
  const { language, theme, toggleTheme, toggleLanguage, setLanguage } = useGlobalUX()
  const isAr = language === 'ar'
  const path = router.asPath.split(/[?#]/)[0]

  useEffect(() => {
    if ((path === '/ar' || path.startsWith('/ar/')) && language !== 'ar') {
      setLanguage('ar')
      return
    }

    if ((path === '/' || path.startsWith('/services/')) && language !== 'en') {
      setLanguage('en')
    }
  }, [language, path, setLanguage])

  function handleLanguageToggle() {
    if (path === '/') {
      setLanguage('ar')
      void router.push('/ar')
      return
    }

    if (path === '/ar') {
      setLanguage('en')
      void router.push('/')
      return
    }

    const englishMatch = path.match(/^\/services\/([^/]+)$/)
    if (englishMatch) {
      const englishSlug = decodeURIComponent(englishMatch[1])
      const arabicService = getArabicServiceForEnglishSlug(englishSlug)

      if (arabicService) {
        setLanguage('ar')
        void router.push(`/ar/services/${arabicService.slug}`)
        return
      }
    }

    const arabicMatch = path.match(/^\/ar\/services\/([^/]+)$/)
    if (arabicMatch) {
      const arabicSlug = decodeURIComponent(arabicMatch[1])
      const englishService = getEnglishServiceForArabicSlug(arabicSlug)

      if (englishService) {
        setLanguage('en')
        void router.push(`/services/${englishService.slug}`)
        return
      }
    }

    toggleLanguage()
  }

  return (
    <header className="absolute top-0 left-0 right-0 z-50 py-6">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link
          href={isAr ? '/ar' : '/'}
          className="text-sm font-bold tracking-[0.2em] text-foreground uppercase flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-gold glow-gold flex-shrink-0" />
          {isAr ? (
            <>
              <span className="text-muted-foreground font-normal">الاستشارات /</span>{' '}
              <span dir="ltr">FAZAL K.</span>
            </>
          ) : (
            <>
              <span dir="ltr">FAZAL K.</span>{' '}
              <span className="text-muted-foreground font-normal">/ ADVISORY</span>
            </>
          )}
        </Link>

        {/* Global UX Toggles */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleLanguageToggle}
            className="flex items-center gap-1.5 px-3 h-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all font-medium border border-transparent hover:border-border/50"
            title={isAr ? 'English' : 'العربية'}
          >
            <Languages className="w-3.5 h-3.5 opacity-70" />
            {isAr ? (
              <span className="text-[10px] tracking-widest font-bold mt-0.5">EN</span>
            ) : (
              <span className="text-[14px] leading-none mb-0.5 font-bold">ع</span>
            )}
          </button>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  )
}
