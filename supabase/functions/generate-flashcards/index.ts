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
    console.log('Generating flashcards for document:', documentId);

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
    const text = new TextDecoder().decode(new Uint8Array(arrayBuffer));
    console.log('Successfully extracted text from PDF, length:', text.length);

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    // Generate flashcards using OpenAI
    const prompt = `Generate exactly 10 flashcards from this text. Each flashcard should have a front (question) and back (answer). Return ONLY a JSON array of objects with 'front' and 'back' properties, with no markdown formatting or explanation. Example format: [{"front": "Question here?", "back": "Answer here"}]

Text to process:
${text.slice(0, 3000)}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates flashcards. Always respond with valid JSON only, no markdown or explanations."
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
      console.log('Successfully generated flashcards:', flashcards.length);

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
        console.error('Error inserting flashcards:', insertError);
        throw new Error('Error saving flashcards');
      }

      return new Response(
        JSON.stringify({ success: true, flashcards }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (parseError) {
      console.error('Error parsing flashcards JSON:', parseError);
      console.error('Raw content:', flashcardsContent);
      throw new Error('Invalid flashcards format returned from AI');
    }

  } catch (error) {
    console.error('Error in generate-flashcards function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});