import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentId } = await req.json();
    console.log('Processing document:', documentId);

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!supabaseUrl || !supabaseKey || !openAIApiKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Dokument abrufen
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      console.error('Document not found:', docError);
      throw new Error('Document not found');
    }

    console.log('Found document:', document.name);

    // PDF-Inhalt aus dem Storage abrufen
    const { data: fileData, error: fileError } = await supabase
      .storage
      .from('pdfs')
      .download(document.file_path);

    if (fileError) {
      console.error('Error downloading file:', fileError);
      throw new Error('Could not download file');
    }

    const pdfText = await fileData.text();
    console.log('Successfully extracted text from PDF');

    // OpenAI API aufrufen
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Du bist ein Experte für die Erstellung von Prüfungsfragen. Analysiere den bereitgestellten Text und erstelle relevante Fragen. 
            Wichtige Regeln:
            1. Erstelle genau 5 Fragen pro identifiziertem Kapitel
            2. Fragen müssen sich DIREKT auf den Inhalt beziehen
            3. Keine allgemeinen oder oberflächlichen Fragen
            4. Jede Frage muss ein spezifisches Konzept oder eine wichtige Information aus dem Text abfragen
            5. Bei Multiple-Choice: Alle Antwortoptionen müssen plausibel sein
            6. Gib hilfreiches, erklärendes Feedback
            7. Verteile die Schwierigkeitsgrade: 2 leicht, 2 mittel, 1 schwer pro Kapitel

            Gib die Fragen in diesem Format zurück:
            {
              "questions": [
                {
                  "document_id": "${documentId}",
                  "course_name": "Name des Kurses aus dem Inhalt",
                  "chapter": "Kapitelnummer und -name",
                  "topic": "Spezifisches Thema der Frage",
                  "difficulty": "easy/medium/advanced",
                  "question_text": "Die eigentliche Frage",
                  "type": "multiple-choice/single-choice/true-false",
                  "points": "5 für easy, 10 für medium, 15 für advanced",
                  "answers": [
                    {
                      "text": "Antworttext",
                      "isCorrect": true/false
                    }
                  ],
                  "feedback": "Ausführliche Erklärung der richtigen Antwort"
                }
              ]
            }`
          },
          {
            role: 'user',
            content: `Erstelle Fragen basierend auf diesem Text: ${pdfText.substring(0, 8000)}`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Received response from OpenAI');

    try {
      const parsedContent = JSON.parse(data.choices[0].message.content);
      console.log('Successfully parsed OpenAI response');
      
      if (!parsedContent.questions || !Array.isArray(parsedContent.questions)) {
        throw new Error('Invalid response format from OpenAI');
      }

      return new Response(
        JSON.stringify({ questions: parsedContent.questions }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      throw new Error('Failed to parse generated questions');
    }
  } catch (error) {
    console.error('Error in generate-questions function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});