import { Playfair_Display, EB_Garamond, Libre_Baskerville } from 'next/font/google'
import Providers from '@/components/Providers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import '@/styles/globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})
const garamond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-garamond',
  display: 'swap',
})
const baskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-baskerville',
  display: 'swap',
})

export const metadata = {
  title: 'The Chronicle — AI News',
  description: "Today's news, intelligently summarised.",
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${garamond.variable} ${baskerville.variable}`}>
      <body>
        <Providers>
          <div className="shell">
            <Navbar />
            <main className="main">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
