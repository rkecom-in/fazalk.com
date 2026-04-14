import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className="light">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {/* Anti-FOUC: apply saved theme before first paint */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var theme = localStorage.getItem('ux-theme') || 'light';
              var lang  = localStorage.getItem('ux-language') || (navigator.language.startsWith('ar') ? 'ar' : 'en');
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
