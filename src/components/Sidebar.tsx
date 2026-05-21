'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from '@/utils/supabase'
import { toast } from 'sonner'

export default function Sidebar() {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  if (!user) return null

  const items = [
    { icon: '🏠', label: 'Dashboard', path: '/' },
    { icon: '📜', label: 'History', path: '/history' },
  ]

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success('Logged out!')
      router.push('/')
    } catch { toast.error('Failed') }
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-purple-600 text-white rounded-lg"
      >
        ☰
      </button>

      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 
        bg-gradient-to-b from-slate-900 to-purple-900 
        backdrop-blur-xl border-r border-purple-500/20
        flex flex-col p-6 gap-2 z-40
        transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">🔮 Future</h2>
          <p className="text-xs text-purple-300">Simulator</p>
        </div>

        {items.map(item => (
          <button
            key={item.path}
            onClick={() => { router.push(item.path); setOpen(false) }}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl
              transition-all duration-200 text-left
              ${pathname === item.path 
                ? 'bg-purple-500/30 text-white border border-purple-400/50 shadow-lg shadow-purple-500/20' 
                : 'text-purple-200 hover:bg-purple-500/10'}
            `}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}

        <div className="mt-auto flex flex-col gap-2">
          <div className="px-4 py-2 text-xs text-purple-300 truncate">
            {user.email}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-pink-300 hover:bg-pink-500/10 transition-all"
          >
            <span>🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}