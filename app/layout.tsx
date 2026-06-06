import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VendorBridge — Procurement & Vendor Management',
  description:
    'Simplify your procurement with VendorBridge: RFQs, quotations, approvals, purchase orders, and analytics in one place.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

import { AuthProvider } from "@/lib/auth-context"
import { StoreProvider } from "@/lib/store-context"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} bg-background`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <StoreProvider>
            {children}
            <Toaster />
            {process.env.NODE_ENV === 'production' && <Analytics />}
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
