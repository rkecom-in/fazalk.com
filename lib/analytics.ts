// Thin wrapper around gtag (GA4 + Google Ads) with Consent Mode v2 helpers.
// All calls are no-ops until NEXT_PUBLIC_GA_ID is set and gtag has loaded, so
// the site works with analytics fully unconfigured.

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-X7E13TM70V'
export const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || ''
// Google Ads conversion action for an enquiry, e.g. "AW-1234567890/AbC-D_efGh".
export const ADS_ENQUIRY_LABEL = process.env.NEXT_PUBLIC_ADS_ENQUIRY_LABEL || ''

export const CONSENT_KEY = 'cookie-consent' // 'granted' | 'denied'
export type ConsentChoice = 'granted' | 'denied'

export const analyticsEnabled = () => GA_ID.length > 0

type GtagArgs =
  | ['js', Date]
  | ['config', string, Record<string, unknown>?]
  | ['event', string, Record<string, unknown>?]
  | ['consent', 'default' | 'update', Record<string, string | number>]

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: GtagArgs[number][]) => void
  }
}

function gtag(...args: GtagArgs[number][]) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag(...args)
}

/** SPA pageview — call on route change (the initial view is sent by config). */
export function pageview(url: string) {
  if (!analyticsEnabled()) return
  gtag('event', 'page_view', { page_path: url, page_location: window.location.href })
}

/** Generic GA4 event. */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (!analyticsEnabled()) return
  gtag('event', name, params)
}

/** Fire a Google Ads conversion (only if a conversion label is configured). */
export function trackConversion(sendTo: string, params: Record<string, unknown> = {}) {
  if (!sendTo) return
  gtag('event', 'conversion', { send_to: sendTo, ...params })
}

/** Update Consent Mode v2 grants and persist the choice. */
export function updateConsent(choice: ConsentChoice) {
  try {
    localStorage.setItem(CONSENT_KEY, choice)
  } catch {
    /* storage unavailable — consent applies for this session only */
  }
  const granted = choice === 'granted'
  gtag('consent', 'update', {
    ad_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    ad_personalization: granted ? 'granted' : 'denied',
    analytics_storage: granted ? 'granted' : 'denied',
  })
}

export function getStoredConsent(): ConsentChoice | null {
  if (typeof window === 'undefined') return null
  try {
    const v = localStorage.getItem(CONSENT_KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    return null
  }
}
