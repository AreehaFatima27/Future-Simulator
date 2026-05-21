'use client'

import { useAuth } from '@/hooks/useAuth'
import { signInWithGoogle } from '@/utils/supabase'
import SimulationForm from '@/components/SimulationForm'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function Home() {
  const { user, loading } = useAuth()

  const handleLogin = async () => {
    try { await signInWithGoogle() }
    catch { toast.error('Failed') }
  }

  if (loading) return null

  if (!user) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute top-40 right-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />

        <div className="relative z-10 text-center flex flex-col gap-8 max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 rounded-full mx-auto w-fit">
            <span>✨</span>
            <span className="text-sm font-medium">Powered by AI</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            See Your Future
          </h1>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Make better decisions with AI-powered scenario predictions. 
            Get three possible futures for any situation in seconds.
          </p>

          <Button 
            onClick={handleLogin}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-purple-500/30 mx-auto"
          >
            🔮 Continue with Google
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            {[
              { icon: '🌟', title: 'Best Case', desc: 'Discover the brightest path forward' },
              { icon: '⚖️', title: 'Average Case', desc: 'Realistic balanced outcomes' },
              { icon: '⚠️', title: 'Worst Case', desc: 'Prepare for challenges ahead' },
            ].map((f, i) => (
              <div key={i} className="p-6 bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl">
                <div className="text-4xl mb-2">{f.icon}</div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 py-4">
      <div className="text-center flex flex-col gap-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Predict Your Future
        </h1>
        <p className="text-slate-400 text-lg">
          What decision are you facing today?
        </p>
      </div>
      <SimulationForm />
    </div>
  )
}