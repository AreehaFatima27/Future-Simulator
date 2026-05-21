'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { getUserSimulations, deleteSimulation } from '@/utils/supabase'
import { Simulation } from '@/utils/types'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import moment from 'moment'
import OutcomeCard from '@/components/OutcomeCard'

export default function History() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [sims, setSims] = useState<Simulation[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Simulation | null>(null)

  useEffect(() => {
    if (!authLoading && !user) router.push('/')
  }, [user, authLoading])

  useEffect(() => {
    if (user) fetchSims()
  }, [user])

  const fetchSims = async () => {
    try {
      setLoading(true)
      const data = await getUserSimulations(user!.id)
      setSims(data)
    } catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    try {
      await deleteSimulation(id)
      setSims(prev => prev.filter(s => s.id !== id))
      toast.success('Deleted!')
    } catch { toast.error('Failed') }
  }

  if (authLoading) return null

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto py-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
          My History
        </h1>
        <p className="text-slate-400 mt-2">Your past simulations</p>
      </div>

      {loading ? (
        <div className="grid gap-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-2xl bg-white/5" />)}
        </div>
      ) : sims.length === 0 ? (
        <div className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
          <p className="text-5xl mb-3">📭</p>
          <p className="text-slate-400">No simulations yet</p>
          <button 
            onClick={() => router.push('/')} 
            className="mt-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-2 rounded-xl"
          >
            Create First Simulation
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sims.map(sim => (
            <div 
              key={sim.id} 
              onClick={() => setSelected(sim)}
              className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-400/40 hover:bg-white/10 rounded-2xl p-4 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="font-medium text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {sim.situation}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {moment(sim.created_at).fromNow()}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDelete(e, sim.id)}
                  className="text-red-400 hover:bg-red-500/20 p-2 rounded-lg transition-all"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="!max-w-[95vw] !w-[95vw] sm:!max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-900 border-purple-500/30 p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Simulation Details
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="flex flex-col gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-sm text-slate-400 mb-2">Situation:</p>
                <p className="text-white">{selected.situation}</p>
                <p className="text-xs text-slate-500 mt-2">
                  {moment(selected.created_at).format('MMMM Do YYYY, h:mm a')}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <OutcomeCard type="best" content={selected.best_case} />
                <OutcomeCard type="average" content={selected.average_case} />
                <OutcomeCard type="worst" content={selected.worst_case} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}