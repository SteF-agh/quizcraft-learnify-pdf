import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { initializePdfWorker, extractTextFromPdf } from './pdfUtils.ts';
import { generateQuestions } from './questionGenerator.ts';

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
    console.log('Generating questions for document:', documentId);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Get document
    const { data: document, error: docError } = await supabaseClient
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      console.error('Document not found:', docError);
      throw new Error('Document not found');
    }

    console.log('Found document:', document.name);

    // Download PDF content
    const { data: fileData, error: downloadError } = await supabaseClient
      .storage
      .from('pdfs')
      .download(document.file_path);

    if (downloadError) {
      console.error('Error downloading PDF:', downloadError);
      throw new Error('Error downloading PDF');
    }

    console.log('Successfully downloaded PDF');

    // Initialize PDF.js worker and extract text
    initializePdfWorker();
    const arrayBuffer = await fileData.arrayBuffer();
    const fullText = await extractTextFromPdf(arrayBuffer);

    // Generate questions
    const generatedQuestions = await generateQuestions(
      {
        documentName: document.name,
        documentId: document.id,
        content: fullText,
      },
      openAIApiKey
    );

    return new Response(
      JSON.stringify({ questions: generatedQuestions }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in generate-questions function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: error.stack || 'No stack trace available'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});