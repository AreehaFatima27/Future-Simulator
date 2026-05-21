export async function POST(request: Request) {
  try {
    const { situation } = await request.json()
    if (!situation || situation.trim().length < 10) {
      return Response.json({ error: 'Min 10 characters' }, { status: 400 })
    }

    const prompt = `You are a future prediction AI. Analyze this situation: ${situation}

Respond ONLY in valid JSON format (no markdown, no extra text):
{
  "best_case": "Detailed best case scenario in 3-4 sentences",
  "average_case": "Detailed average case scenario in 3-4 sentences",
  "worst_case": "Detailed worst case scenario in 3-4 sentences"
}`

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' }
        })
      }
    )

    if (!response.ok) {
      const err = await response.text()
      console.log('GROQ ERROR:', err)
      return Response.json({ error: 'AI failed' }, { status: 500 })
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content
    if (!text) return Response.json({ error: 'No response' }, { status: 500 })

    const parsed = JSON.parse(text)

    if (!parsed.best_case || !parsed.average_case || !parsed.worst_case) {
      return Response.json({ error: 'Invalid format' }, { status: 500 })
    }
    return Response.json(parsed)
  } catch {
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}