import Navbar from '@/components/Navbar'
import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
const inter = Inter({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Dream',
  description: 'Find your dream home',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider dynamic>
      <html lang='en'>
        <body className={`${inter.variable} antialiased`}>
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
