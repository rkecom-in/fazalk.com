import Link from 'next/link'
import { useGlobalUX } from '@/components/providers/GlobalUXProvider'
import { Sun, Moon } from 'lucide-react'

const VIABE_URL = 'https://viabe.ai'

export default function SiteHeader() {
  const { t, theme, toggleTheme } = useGlobalUX()

  return (
    <header className="absolute top-0 left-0 right-0 z-50 py-6">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link
          href="/"
          className="text-sm font-bold tracking-[0.2em] text-foreground uppercase flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-gold glow-gold flex-shrink-0" />
          <span>FAZAL KHAN</span>
        </Link>

        {/* Global UX Toggles */}
        <div className="flex items-center gap-2">
          <a
            href={VIABE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center h-8 px-4 rounded-full text-xs font-semibold tracking-wide text-foreground border border-border/60 hover:border-gold/50 hover:text-gold transition-all"
          >
            {t.nav.viabe}
          </a>

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
