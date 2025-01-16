import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import OpenAI from 'https://esm.sh/openai@4.20.1';

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
    console.log('Generiere Lernkarten für Dokument:', documentId);

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get document content
    const { data: document, error: docError } = await supabaseClient
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      console.error('Dokument nicht gefunden:', docError);
      throw new Error('Dokument nicht gefunden');
    }

    // Download PDF content
    const { data: fileData, error: downloadError } = await supabaseClient
      .storage
      .from('pdfs')
      .download(document.file_path);

    if (downloadError) {
      console.error('Fehler beim Herunterladen der PDF:', downloadError);
      throw new Error('Fehler beim Herunterladen der PDF');
    }

    // Convert PDF to text
    const arrayBuffer = await fileData.arrayBuffer();
    const text = new TextDecoder().decode(new Uint8Array(arrayBuffer));
    console.log('Text erfolgreich aus PDF extrahiert, Länge:', text.length);

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    // Generate flashcards using OpenAI
    const prompt = `Erstelle genau 10 Lernkarten aus diesem Text. Jede Lernkarte sollte eine Vorderseite (Frage) und eine Rückseite (Antwort) haben. Gib NUR ein JSON-Array mit Objekten zurück, die 'front' und 'back' Eigenschaften haben, ohne Markdown-Formatierung oder Erklärungen. Beispielformat: [{"front": "Frage hier?", "back": "Antwort hier"}]

Text zum Verarbeiten:
${text.slice(0, 3000)}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Du bist ein hilfreicher Assistent, der Lernkarten auf Deutsch erstellt. Antworte ausschließlich mit validem JSON, ohne Markdown oder Erklärungen."
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    let flashcardsContent = completion.choices[0].message.content || '[]';
    
    // Clean up the response if it contains markdown formatting
    try {
      // Remove any markdown code block indicators if present
      flashcardsContent = flashcardsContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      // Parse the JSON content
      const flashcards = JSON.parse(flashcardsContent.trim());
      console.log('Lernkarten erfolgreich generiert:', flashcards.length);

      // Store flashcards in database
      const { error: insertError } = await supabaseClient
        .from('flashcards')
        .insert(
          flashcards.map((card: any) => ({
            document_id: documentId,
            front: card.front,
            back: card.back,
          }))
        );

      if (insertError) {
        console.error('Fehler beim Speichern der Lernkarten:', insertError);
        throw new Error('Fehler beim Speichern der Lernkarten');
      }

      return new Response(
        JSON.stringify({ success: true, flashcards }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (parseError) {
      console.error('Fehler beim Parsen der Lernkarten JSON:', parseError);
      console.error('Roher Inhalt:', flashcardsContent);
      throw new Error('Ungültiges Lernkarten-Format von der KI zurückgegeben');
    }

  } catch (error) {
    console.error('Fehler in generate-flashcards Funktion:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});