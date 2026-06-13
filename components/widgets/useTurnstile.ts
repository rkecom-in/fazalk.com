import { useCallback, useEffect, useRef } from 'react'

/**
 * Cloudflare Turnstile in execute mode — fetches a fresh token on demand.
 *
 * No-op until NEXT_PUBLIC_TURNSTILE_SITE_KEY is set (getToken returns null,
 * which the server accepts only when TURNSTILE_SECRET_KEY is also unset).
 * Create an *invisible* Turnstile widget in the Cloudflare dashboard and set
 * both keys to enforce. See lib/turnstile.ts.
 */
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  execute: (id: string, opts?: Record<string, unknown>) => void
  reset: (id: string) => void
  remove: (id: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('no window'))
    if (window.turnstile) return resolve()
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('turnstile script failed')))
      if (window.turnstile) resolve()
      return
    }
    const s = document.createElement('script')
    s.src = SCRIPT_SRC
    s.async = true
    s.defer = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('turnstile script failed'))
    document.head.appendChild(s)
  })
}

export function useTurnstile() {
  const widgetId = useRef<string | null>(null)
  const resolver = useRef<((t: string | null) => void) | null>(null)

  useEffect(() => {
    if (!SITE_KEY) return
    let cancelled = false
    const container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)

    loadScript()
      .then(() => {
        if (cancelled || !window.turnstile) return
        widgetId.current = window.turnstile.render(container, {
          sitekey: SITE_KEY,
          execution: 'execute',
          appearance: 'interaction-only',
          callback: (token: string) => { resolver.current?.(token); resolver.current = null },
          'error-callback': () => { resolver.current?.(null); resolver.current = null },
          'expired-callback': () => { resolver.current?.(null); resolver.current = null },
        })
      })
      .catch(() => { /* leave disabled; getToken returns null */ })

    return () => {
      cancelled = true
      try { if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current) } catch { /* ignore */ }
      try { container.remove() } catch { /* ignore */ }
      widgetId.current = null
    }
  }, [])

  const getToken = useCallback(async (): Promise<string | null> => {
    if (!SITE_KEY || !window.turnstile || !widgetId.current) return null
    return new Promise<string | null>(resolve => {
      const timer = setTimeout(() => { resolver.current = null; resolve(null) }, 8000)
      resolver.current = (t: string | null) => { clearTimeout(timer); resolve(t) }
      try {
        window.turnstile!.reset(widgetId.current!)
        window.turnstile!.execute(widgetId.current!)
      } catch {
        clearTimeout(timer)
        resolver.current = null
        resolve(null)
      }
    })
  }, [])

  return { getToken, enabled: Boolean(SITE_KEY) }
}
