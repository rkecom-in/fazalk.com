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
};

export default nextConfig;
