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
    const prompt = `Create 10 flashcards from the following text. Each flashcard should have a question on the front and the answer on the back. Format the output as a JSON array of objects with 'front' and 'back' properties. The questions should test understanding of key concepts.

Text:
${text.slice(0, 3000)} // Limit text length to avoid token limits

Example format:
[
  {
    "front": "What is...",
    "back": "It is..."
  }
]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates flashcards from educational content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    const flashcardsContent = completion.choices[0].message.content || '[]';
    const flashcards = JSON.parse(flashcardsContent);
    console.log('Generated flashcards:', flashcards);

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