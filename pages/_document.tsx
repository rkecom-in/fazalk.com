import NextDocument, {
  Head,
  Html,
  Main,
  NextScript,
  type DocumentContext,
  type DocumentInitialProps,
} from 'next/document'
import type { Language } from '@/lib/i18n'

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
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
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
              } catch(e) {}
            })();
          `}} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
