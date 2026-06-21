import { useEffect, useState } from 'react'
import Link from 'next/link'
import { analyticsEnabled, getStoredConsent, updateConsent } from '@/lib/analytics'
import { useGlobalUX } from '@/components/providers/GlobalUXProvider'

// Consent Mode v2 banner. Only shown when analytics is configured and the
// visitor has not yet made a choice. Default consent is denied (set in
// _document) until the visitor accepts here.
export default function ConsentBanner() {
  const { language } = useGlobalUX()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (analyticsEnabled() && getStoredConsent() === null) setVisible(true)
  }, [])

  if (!visible) return null

  const isAr = language === 'ar'
  const choose = (choice: 'granted' | 'denied') => {
    updateConsent(choice)
    setVisible(false)
  }

  return (
    <div
      role="dialog"
      aria-label={isAr ? 'إعداد ملفات تعريف الارتباط' : 'Cookie preferences'}
      className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6"
    >
      <div className="mx-auto max-w-3xl rounded-xl border border-border bg-card/95 backdrop-blur-md shadow-[var(--shadow-card)] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">
          {isAr
            ? 'يستخدم هذا الموقع ملفات تعريف الارتباط للتحليلات والإعلانات لفهم الاستخدام وتحسينه.'
            : 'This site uses cookies for analytics and ads to understand usage and improve it.'}{' '}
          <Link href="/privacy" className="text-gold underline-offset-4 hover:underline">
            {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </Link>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => choose('denied')}
            className="px-4 py-2 rounded-lg border border-border text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-secondary transition-colors"
          >
            {isAr ? 'رفض' : 'Decline'}
          </button>
          <button
            onClick={() => choose('granted')}
            className="px-4 py-2 rounded-lg bg-gold text-primary-foreground text-xs font-semibold uppercase tracking-widest hover:bg-gold-dark transition-colors"
          >
            {isAr ? 'قبول' : 'Accept'}
          </button>
        </div>
      </div>
    </div>
  )
}
