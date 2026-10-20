import type {Metadata, Viewport} from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {CartProvider} from '@/components/CartProvider'
import {THEME_SCRIPT} from '@/components/ThemeToggle'
import {getCities, getSettings} from '@/lib/data'

export const metadata: Metadata = {
  metadataBase: new URL('https://welcome2.uz'),
  title: {default: 'Welcome 2 UZB · Souvenir passport for Uzbekistan', template: '%s · Welcome 2 UZB'},
  description: 'A pocket passport for Tashkent, Samarkand, Bukhara and Khiva. Collect an original stamp in every city.',
  openGraph: {siteName: 'Welcome 2 UZB', type: 'website'},
}
export const viewport: Viewport = {themeColor: [{media: '(prefers-color-scheme: light)', color: '#f3f7f6'}, {media: '(prefers-color-scheme: dark)', color: '#0c1a1d'}], width: 'device-width', initialScale: 1}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  // Футер общий для всех языков, поэтому названия городов берём сразу на трёх языках.
  const [en, ru, uz, settings] = await Promise.all([getCities('en'), getCities('ru'), getCities('uz'), getSettings()])
  const cities = {en, ru, uz}
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html: THEME_SCRIPT}} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Onest:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>
        <CartProvider>
          <div className="flagline" aria-hidden="true" />
          <Header />
          <main>{children}</main>
          <Footer cities={cities} settings={settings} />
        </CartProvider>
      </body>
    </html>
  )
}
