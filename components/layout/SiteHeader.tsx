import Link from 'next/link'
import { useGlobalUX } from '@/components/providers/GlobalUXProvider'
import { Sun, Moon, Languages } from 'lucide-react'

export default function SiteHeader() {
  const { language, t, theme, toggleTheme, toggleLanguage } = useGlobalUX()
  const isAr = language === 'ar'

  return (
    <header className="absolute top-0 left-0 right-0 z-50 py-6">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link
          href="/"
          className="text-sm font-bold tracking-[0.2em] text-foreground uppercase flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-gold glow-gold flex-shrink-0" />
          {isAr ? (
            <>
              <span className="text-muted-foreground font-normal">الاستشارات /</span>{' '}
              FAZAL K.
            </>
          ) : (
            <>
              FAZAL K.{' '}
              <span className="text-muted-foreground font-normal">/ ADVISORY</span>
            </>
          )}
        </Link>

        {/* Global UX Toggles */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleLanguage}
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
