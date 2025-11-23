import type { Metadata } from "next";
import { Geist } from 'next/font/google'
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";

const geist = Geist({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Dua Insan Story - Admin",
  description: "Admin panel untuk Dua Insan Story",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>
        <Script id="ensure-nextjs-portal" strategy="beforeInteractive">
          {`
            (function () {
              if (typeof window === 'undefined') return;

              function ensurePortal() {
                var existing = document.querySelector('nextjs-portal');
                if (!existing) {
                  existing = document.createElement('nextjs-portal');
                  existing.style.cssText = 'display: contents;';
                  document.body.appendChild(existing);
                } else if (!existing.isConnected) {
                  document.body.appendChild(existing);
                }

                if (existing && !existing.shadowRoot && existing.attachShadow) {
                  try {
                    existing.attachShadow({ mode: 'open' });
                  } catch (error) {
                    console.warn('Failed to attach shadow root for nextjs-portal', error);
                  }
                }
              }

              if (document.readyState === 'complete' || document.readyState === 'interactive') {
                ensurePortal();
              } else {
                document.addEventListener('DOMContentLoaded', ensurePortal, { once: true });
              }
            })();
          `}
        </Script>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
            <Toaster richColors />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
