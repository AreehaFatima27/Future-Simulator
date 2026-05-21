'use client'

import { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button } from '@/components/ui/button'
import { saveSimulation, castVote, getVoteCounts, getUserVote } from '@/utils/supabase'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import OutcomeCard from './OutcomeCard'
import { Skeleton } from '@/components/ui/skeleton'

export default function SimulationForm() {
  const { user } = useAuth()
  const [outcomes, setOutcomes] = useState<{best_case: string, average_case: string, worst_case: string} | null>(null)
  const [loading, setLoading] = useState(false)
  const [simulationId, setSimulationId] = useState<string | null>(null)
  const [voteCounts, setVoteCounts] = useState({ best: 0, average: 0, worst: 0 })
  const [userVote, setUserVote] = useState<'best' | 'average' | 'worst' | null>(null)

  const formik = useFormik({
    initialValues: { situation: '' },
    validationSchema: Yup.object({
      situation: Yup.string().min(10, 'Min 10 characters').max(500, 'Max 500 characters').required('Required')
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true)
        setOutcomes(null)
        setSimulationId(null)
        setUserVote(null)
        setVoteCounts({ best: 0, average: 0, worst: 0 })
        
        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ situation: values.situation })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setOutcomes(data)
        toast.success('Future predicted! ✨')

        if (user) {
          try {
            const saved = await saveSimulation({
              situation: values.situation,
              best_case: data.best_case,
              average_case: data.average_case,
              worst_case: data.worst_case,
              user_id: user.id
            })
            setSimulationId(saved.id)
            toast.success('Auto-saved!')
          } catch {}
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to predict future')
      } finally {
        setLoading(false)
      }
    }
  })

  const handleClear = () => {
    formik.setFieldValue('situation', '')
    setOutcomes(null)
    setSimulationId(null)
    toast.success('Cleared!')
  }

  const handleVote = async (voteType: 'best' | 'average' | 'worst') => {
    if (!user || !simulationId) {
      toast.error('Please login to vote')
      return
    }
    try {
      await castVote(simulationId, user.id, voteType)
      setUserVote(voteType)
      const counts = await getVoteCounts(simulationId)
      setVoteCounts(counts)
      toast.success('Vote recorded! 🎉')
    } catch {
      toast.error('Failed to vote')
    }
  }

  useEffect(() => {
    if (simulationId && user) {
      getVoteCounts(simulationId).then(setVoteCounts).catch(() => {})
      getUserVote(simulationId, user.id).then(setUserVote).catch(() => {})
    }
  }, [simulationId, user])

  const total = voteCounts.best + voteCounts.average + voteCounts.worst
  const pct = (n: number) => total === 0 ? 0 : Math.round((n / total) * 100)

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full">
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-300">Your Situation or Decision</label>
            <span className="text-xs text-slate-400">{formik.values.situation.length}/500</span>
          </div>
          <textarea
            name="situation"
            placeholder="e.g., Should I quit my job to start a business?"
            value={formik.values.situation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={5}
            className="w-full rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-4 text-white placeholder:text-slate-500 text-base resize-none focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all shadow-xl"
          />
          {formik.touched.situation && formik.errors.situation && (
            <p className="text-sm text-red-400">{formik.errors.situation}</p>
          )}
        </div>
        <div className="flex gap-3">
          <Button 
            type="submit" 
            disabled={loading} 
            size="lg"
            className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white rounded-2xl shadow-lg shadow-purple-500/30"
          >
            {loading ? '🔮 Simulating...' : '🔮 Predict My Future'}
          </Button>
          {formik.values.situation && (
            <Button 
              type="button"
              onClick={handleClear}
              variant="outline"
              size="lg"
              className="bg-white/5 backdrop-blur-xl border border-white/10 text-slate-300 hover:bg-red-500/20 hover:text-red-300 hover:border-red-400/30 rounded-2xl"
            >
              Clear
            </Button>
          )}
        </div>
      </form>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-flex gap-3 mb-4">
            <span className="text-5xl animate-bounce" style={{animationDelay: '0ms'}}>🔮</span>
            <span className="text-5xl animate-bounce" style={{animationDelay: '150ms'}}>✨</span>
            <span className="text-5xl animate-bounce" style={{animationDelay: '300ms'}}>🌟</span>
          </div>
          <p className="text-purple-300 animate-pulse text-lg">AI is analyzing your future...</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[1,2,3].map(i => <Skeleton key={i} className="h-48 rounded-3xl bg-white/5" />)}
          </div>
        </div>
      )}

      {outcomes && !loading && (
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Your 3 Possible Futures
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <OutcomeCard type="best" content={outcomes.best_case} />
            <OutcomeCard type="average" content={outcomes.average_case} />
            <OutcomeCard type="worst" content={outcomes.worst_case} />
          </div>
          
          {simulationId && (
            <div className="mt-6 p-6 bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  <h3 className="text-lg font-bold text-white">Community Insights</h3>
                </div>
                <button
                  onClick={() => {
                    const text = `🔮 My Future Simulation:\n\nSituation: ${formik.values.situation}\n\n🌟 Best: ${outcomes.best_case}\n\n⚖️ Average: ${outcomes.average_case}\n\n⚠️ Worst: ${outcomes.worst_case}\n\nTry it: ${window.location.origin}`
                    navigator.clipboard.writeText(text)
                    toast.success('Link copied! Share with friends 🚀')
                  }}
                  className="text-xs bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-2 rounded-xl"
                >
                  🔗 Share
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-sm text-slate-400">
                  {userVote ? '✓ You voted! Click again to change' : 'Which future feels most likely to you?'}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => handleVote('best')}
                    className={`p-3 border rounded-xl transition-all ${userVote === 'best' ? 'bg-green-500/30 border-green-400 scale-105' : 'bg-green-500/10 border-green-400/30 hover:bg-green-500/20'}`}
                  >
                    <div className="text-2xl mb-1">🌟</div>
                    <p className="text-xs text-green-300">Best Case</p>
                    <p className="text-xs text-slate-400 mt-1">{voteCounts.best} votes ({pct(voteCounts.best)}%)</p>
                  </button>
                  <button 
                    onClick={() => handleVote('average')}
                    className={`p-3 border rounded-xl transition-all ${userVote === 'average' ? 'bg-blue-500/30 border-blue-400 scale-105' : 'bg-blue-500/10 border-blue-400/30 hover:bg-blue-500/20'}`}
                  >
                    <div className="text-2xl mb-1">⚖️</div>
                    <p className="text-xs text-blue-300">Average</p>
                    <p className="text-xs text-slate-400 mt-1">{voteCounts.average} votes ({pct(voteCounts.average)}%)</p>
                  </button>
                  <button 
                    onClick={() => handleVote('worst')}
                    className={`p-3 border rounded-xl transition-all ${userVote === 'worst' ? 'bg-red-500/30 border-red-400 scale-105' : 'bg-red-500/10 border-red-400/30 hover:bg-red-500/20'}`}
                  >
                    <div className="text-2xl mb-1">⚠️</div>
                    <p className="text-xs text-red-300">Worst</p>
                    <p className="text-xs text-slate-400 mt-1">{voteCounts.worst} votes ({pct(voteCounts.worst)}%)</p>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}