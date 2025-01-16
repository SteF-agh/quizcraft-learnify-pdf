import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import OpenAI from "https://esm.sh/openai@4.20.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userAnswer, correctAnswer } = await req.json()

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Du bist ein Lehrer, der Antworten bewertet. Antworte nur mit 'true' oder 'false', je nachdem ob die Antwort inhaltlich größtenteils korrekt ist."
        },
        {
          role: "user",
          content: `Korrekte Antwort: "${correctAnswer}"\nBenutzerantwort: "${userAnswer}"\nIst die Antwort inhaltlich größtenteils richtig?`
        }
      ]
    })

    const isCorrect = completion.choices[0].message.content.toLowerCase().includes('true')

    return new Response(
      JSON.stringify({ isCorrect }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})