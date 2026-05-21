'use client'

import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
  type: 'best' | 'average' | 'worst'
  content: string
}

export default function OutcomeCard({ type, content }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [whatIf, setWhatIf] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [loading, setLoading] = useState(false)

  const config = {
    best: { 
      emoji: '🌟', 
      title: 'Best Case', 
      gradient: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-400/30',
      glow: 'shadow-green-500/20'
    },
    average: { 
      emoji: '⚖️', 
      title: 'Average Case', 
      gradient: 'from-blue-500/20 to-cyan-500/20',
      border: 'border-blue-400/30',
      glow: 'shadow-blue-500/20'
    },
    worst: { 
      emoji: '⚠️', 
      title: 'Worst Case', 
      gradient: 'from-red-500/20 to-pink-500/20',
      border: 'border-red-400/30',
      glow: 'shadow-red-500/20'
    }
  }
  const c = config[type]

  const handleWhatIf = async () => {
    if (whatIf.trim().length < 5) {
      toast.error('Enter a what-if scenario')
      return
    }
    try {
      setLoading(true)
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ situation: `Original: ${content}. What if ${whatIf}? Give a single detailed analysis (no JSON, just plain text in 3-4 sentences).` })
      })
      const data = await res.json()
      setAnalysis(data.best_case || data.average_case || 'Analysis: ' + whatIf + ' could significantly change this outcome.')
    } catch {
      setAnalysis('Unable to analyze right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`
      bg-gradient-to-br ${c.gradient} 
      backdrop-blur-xl 
      border-2 ${c.border} 
      rounded-3xl p-6 
      shadow-xl ${c.glow}
      transition-all duration-300
      hover:shadow-2xl
    `}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">{c.emoji}</span>
        <h3 className="text-xl font-bold text-white">{c.title}</h3>
      </div>
      <p className="text-sm leading-relaxed text-slate-200 mb-4">{content}</p>
      
      <button 
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-purple-300 hover:text-purple-200 font-medium"
      >
        {expanded ? '▲ Hide What If' : '✨ What If?'}
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
          <input
            type="text"
            value={whatIf}
            onChange={(e) => setWhatIf(e.target.value)}
            placeholder="e.g., I get additional training?"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={handleWhatIf}
            disabled={loading}
            className="text-xs bg-purple-600/50 hover:bg-purple-600 text-white px-3 py-2 rounded-xl transition-all"
          >
            {loading ? 'Analyzing...' : '🔮 Re-simulate'}
          </button>
          {analysis && (
            <div className="mt-2 p-3 bg-white/5 rounded-xl text-xs text-slate-200 leading-relaxed">
              {analysis}
            </div>
          )}
        </div>
      )}
    </div>
  )
}