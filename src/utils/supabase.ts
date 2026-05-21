import { createClient } from '@supabase/supabase-js'
import { Simulation } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
  if (error) throw error
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getUserSimulations = async (userId: string) => {
  const { data, error } = await supabase
    .from('simulations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Simulation[]
}

export const createSimulation = async (
  simulation: Omit<Simulation, 'id' | 'created_at'>
) => {
  const { data, error } = await supabase
    .from('simulations')
    .insert(simulation)
    .select()
    .single()
  if (error) throw error
  return data as Simulation
}

export const deleteSimulation = async (id: string) => {
  const { error } = await supabase
    .from('simulations')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export const saveSimulation = createSimulation

export const castVote = async (simulationId: string, userId: string, voteType: 'best' | 'average' | 'worst') => {
  const { error } = await supabase
    .from('votes')
    .upsert({ 
      simulation_id: simulationId, 
      user_id: userId, 
      vote_type: voteType 
    }, { 
      onConflict: 'simulation_id,user_id' 
    })
  if (error) throw error
}

export const getVoteCounts = async (simulationId: string) => {
  const { data, error } = await supabase
    .from('votes')
    .select('vote_type')
    .eq('simulation_id', simulationId)
  
  if (error) throw error
  
  const counts = { best: 0, average: 0, worst: 0 }
  data?.forEach((v: any) => {
    counts[v.vote_type as 'best' | 'average' | 'worst']++
  })
  return counts
}

export const getUserVote = async (simulationId: string, userId: string) => {
  const { data, error } = await supabase
    .from('votes')
    .select('vote_type')
    .eq('simulation_id', simulationId)
    .eq('user_id', userId)
    .maybeSingle()
  
  if (error) throw error
  return data?.vote_type as 'best' | 'average' | 'worst' | null
}