import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import { Toaster } from '@/components/ui/sonner'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Future Simulator',
  description: 'See your 3 possible futures with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-slate-950 text-white min-h-screen relative overflow-x-hidden`}>
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.15),transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_rgba(6,182,212,0.1),transparent_50%)]" />
          <div className="stars-bg"></div>
          <div className="floating-orb w-96 h-96 bg-purple-500/10 top-20 left-20" />
          <div className="floating-orb w-96 h-96 bg-cyan-500/10 bottom-20 right-20" style={{ animationDelay: '5s' }} />
        </div>
        <div className="flex min-h-screen relative z-10">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
              {children}
            </div>
          </main>
        </div>
        <Toaster theme="dark" />
      </body>
    </html>
  )
}