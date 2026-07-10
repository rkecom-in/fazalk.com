import type { NextConfig } from "next";

// Baseline security headers. A Content-Security-Policy is intentionally omitted
// here: the anti-FOUC inline script in _document.tsx and the Turnstile/Google
// Fonts third parties require a nonce/hash-based CSP, which should be added in a
// dedicated pass after that inline script is converted to a hashed form.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Consolidate legacy URLs onto the canonical home. Emits 308 (permanent);
  // Google treats it as a 301 equivalent.
  //  - /index.html, /invite: pre-"open site" era.
  //  - /ar and /ar/*: the Arabic surface is retired for the English-only
  //    founder-page launch (0003 §5); the i18n scaffolding stays dormant.
  //  - /services/*: the consulting SEO service pages were removed (0003 §4).
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/invite", destination: "/", permanent: true },
      { source: "/ar", destination: "/", permanent: true },
      { source: "/ar/:path*", destination: "/", permanent: true },
      { source: "/services", destination: "/", permanent: true },
      { source: "/services/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
