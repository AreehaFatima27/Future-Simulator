'use client'

import { signInWithGoogle, signOut } from '@/utils/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'

export default function Header() {
  const { user, loading } = useAuth()

  const handleLogin = async () => {
    try { await signInWithGoogle() }
    catch { toast.error('Failed to login') }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success('Logged out!')
    } catch { toast.error('Failed to logout') }
  }

  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="text-2xl font-bold">🔮 Future Simulator</a>
        <div className="flex items-center gap-3">
          {loading ? <div className="h-9 w-20 bg-muted animate-pulse rounded-md" /> : user ? (
            <div className="flex items-center gap-3">
              <a href="/history"><Button variant="outline" size="sm">My History</Button></a>
              <Avatar className="h-9 w-9 cursor-pointer" onClick={handleLogout}>
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback>{user.user_metadata?.full_name?.charAt(0) ?? user.email?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          ) : <Button onClick={handleLogin}>Login with Google</Button>}
        </div>
      </div>
    </header>
  )
}