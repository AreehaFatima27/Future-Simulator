export interface Simulation {
  id: string
  situation: string
  best_case: string
  average_case: string
  worst_case: string
  category: string
  user_id: string
  created_at: string
}

export interface User {
  id: string
  email: string
  user_metadata: {
    full_name: string
    avatar_url: string
  }
}

export interface GeminiResponse {
  best_case: string
  average_case: string
  worst_case: string
}