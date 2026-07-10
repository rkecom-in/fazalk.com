import NextDocument, {
  Head,
  Html,
  Main,
  NextScript,
  type DocumentContext,
  type DocumentInitialProps,
} from 'next/document'
import type { Language } from '@/lib/i18n'
import { GA_ID, ADS_ID } from '@/lib/analytics'

type DocumentProps = DocumentInitialProps & {
  language: Language
}

export default class Document extends NextDocument<DocumentProps> {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentProps> {
    const initialProps = await NextDocument.getInitialProps(ctx)
    const language = ctx.pathname === '/ar' || ctx.pathname.startsWith('/ar/') ? 'ar' : 'en'

    return {
      ...initialProps,
      language,
    }
  }

  render() {
    const dir = this.props.language === 'ar' ? 'rtl' : 'ltr'

    return (
      <Html lang={this.props.language} dir={dir} className="dark">
        <Head>
          {/* Fonts are self-hosted via next/font (see _app.tsx) — no external
              font stylesheet or preconnect on the critical path. */}
          {/* Anti-FOUC: apply route language and saved theme before first paint */}
          <script dangerouslySetInnerHTML={{ __html: `
            (function() {
              try {
                var path = window.location.pathname || '/';
                var routeLang = (path === '/ar' || path.indexOf('/ar/') === 0) ? 'ar' : ((path === '/' || path.indexOf('/services/') === 0) ? 'en' : null);
                var theme = localStorage.getItem('ux-theme') || 'dark';
                var savedLang = localStorage.getItem('ux-language');
                var lang = routeLang || savedLang || (navigator.language.startsWith('ar') ? 'ar' : 'en');
                var el = document.documentElement;
                el.classList.remove('dark', 'light', 'high-contrast', 'text-large');
                el.classList.add(theme);
                el.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
                el.setAttribute('lang', lang);
                // Enable scroll-reveal only with JS + motion allowed (avoids FOUC; safe no-JS fallback)
                if (!window.matchMedia || !matchMedia('(prefers-reduced-motion: reduce)').matches) el.classList.add('reveal-on');
              } catch(e) {}
            })();
          `}} />

          {/* Google Analytics 4 + Google Ads with Consent Mode v2.
              Consent defaults to denied; the banner grants on accept. The inline
              snippet runs before gtag.js finishes loading and queues consent +
              config in dataLayer, so ordering is correct. */}
          {GA_ID && (
            <>
              <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
              <script dangerouslySetInnerHTML={{ __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
                try{if(localStorage.getItem('cookie-consent')==='granted'){gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});}}catch(e){}
                gtag('js', new Date());
                gtag('config','${GA_ID}');
                ${ADS_ID ? `gtag('config','${ADS_ID}');` : ''}
              `}} />
            </>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
