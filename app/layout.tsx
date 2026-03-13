import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'

// Load Nunito via next/font (optimized, no layout shift)
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-nunito',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'VerseVerse ✨ — Your Magical Poem Generator',
  description: 'Create beautiful, AI-powered poems in seconds. Choose your theme, tone, and style — then let the magic happen.',
  keywords: ['poem generator', 'AI poetry', 'creative writing', 'poem maker'],
  openGraph: {
    title: 'VerseVerse ✨',
    description: 'Your magical AI poem generator',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={nunito.variable}>
      <head>
        {/* Pacifico & Lora loaded here for heading/poem use */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&family=Lora:ital,wght@0,400;0,600;1,400;1,600&display=swap"
          rel="stylesheet"
        />
        {/* Emoji favicon — shows 🌸 in the browser tab */}
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌸</text></svg>"
        />
      </head>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  )
}
