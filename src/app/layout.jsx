import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Layout/Navbar'
import { LedgerProvider } from '@/contexts/LedgerContext'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Ledger ERP System',
  description: 'Complete ERP System with Google Sheets Sync',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LedgerProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>{children}</main>
            <Toaster position="top-right" />
          </div>
        </LedgerProvider>
      </body>
    </html>
  )
}
