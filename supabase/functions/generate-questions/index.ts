import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { decode } from 'https://deno.land/std@0.177.0/encoding/base64.ts';

interface Question {
  type: 'multiple-choice' | 'true-false' | 'open' | 'matching' | 'fill-in';
  text: string;
  options?: string[];
  correctAnswer: string | number | boolean;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentId, questionType } = await req.json();
    console.log('Received request for document:', documentId, 'questionType:', questionType);

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get document details
    const { data: document, error: docError } = await supabaseClient
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      console.error('Document not found:', docError);
      throw new Error('Document not found');
    }

    // Download PDF content
    const { data: fileData, error: downloadError } = await supabaseClient
      .storage
      .from('pdfs')
      .download(document.file_path);

    if (downloadError) {
      console.error('Error downloading PDF:', downloadError);
      throw new Error('Error downloading PDF');
    }

    // Convert PDF to text
    const arrayBuffer = await fileData.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const text = new TextDecoder().decode(bytes);
    console.log('Successfully extracted text from PDF, length:', text.length);

    // Generate questions using GPT-4
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Du bist ein erfahrener Pädagoge und Experte für die Erstellung von Lernmaterialien. Deine Aufgabe ist es, hochwertige Quizfragen zu erstellen, die das Verständnis des Lernenden für den bereitgestellten Text testen.

Wichtige Richtlinien für die Fragenerstellung:
1. Erstelle NUR Fragen, die sich DIREKT auf spezifische Informationen aus dem Text beziehen.
2. Vermeide allgemeine oder oberflächliche Fragen.
3. Formuliere die Fragen klar und präzise auf Deutsch.
4. Bei Multiple-Choice-Fragen:
   - Stelle sicher, dass alle Antwortoptionen plausibel sind
   - Vermeide offensichtlich falsche Antworten
   - Verwende 3-4 Antwortoptionen
5. Bei Wahr/Falsch-Fragen:
   - Beziehe dich auf konkrete Fakten aus dem Text
   - Vermeide mehrdeutige Aussagen
6. Bei offenen Fragen:
   - Frage nach spezifischen Konzepten oder Definitionen
   - Die Antwort sollte direkt aus dem Text ableitbar sein

Gib die Fragen als JSON-Array zurück, mit genau dieser Struktur:
{
  "type": "multiple-choice" | "true-false" | "open" | "matching" | "fill-in",
  "text": "Fragetext",
  "options": ["Array", "von", "Optionen"] (nur für multiple-choice, matching),
  "correctAnswer": number (Index für multiple-choice/matching) | boolean (für true-false) | string (für open/fill-in)
}`
          },
          {
            role: "user",
            content: `Generiere 5 ${questionType === 'all' ? 'verschiedene' : questionType} Fragen zu diesem Text. Beachte dabei die oben genannten Richtlinien und beziehe dich ausschließlich auf den folgenden Inhalt: 

${text.substring(0, 4000)}`
          }
        ]
      })
    });

    const gptResponse = await response.json();
    console.log('Received GPT response:', gptResponse);

    if (!gptResponse.choices?.[0]?.message?.content) {
      console.error('Invalid GPT response structure:', gptResponse);
      throw new Error('Invalid response from GPT');
    }

    let questions: Question[];
    try {
      // Clean up the response content
      const content = gptResponse.choices[0].message.content.trim()
        .replace(/```json\n?/g, '') // Remove JSON code block markers if present
        .replace(/```\n?/g, '')     // Remove closing code block marker if present
        .trim();                    // Remove any extra whitespace
      
      console.log('Cleaned GPT response content:', content);
      
      questions = JSON.parse(content);
      
      if (!Array.isArray(questions)) {
        console.error('Response is not an array:', questions);
        throw new Error('Response is not an array');
      }
      
      // Validate each question
      questions.forEach((q, index) => {
        if (!q.type || !q.text || (q.type === 'multiple-choice' && !Array.isArray(q.options))) {
          console.error(`Invalid question format at index ${index}:`, q);
          throw new Error(`Invalid question format at index ${index}`);
        }
      });

      console.log('Successfully validated questions format');
    } catch (error) {
      console.error('Error parsing GPT response:', error);
      throw new Error('Failed to parse questions from GPT response');
    }

    console.log('Successfully generated questions:', questions);

    return new Response(
      JSON.stringify({ questions }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in generate-questions function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});