import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { extractTextFromPdf } from './pdfUtils.ts';
import { generateQuestions } from './questionGenerator.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting question generation process...');
    
    // Get request body
    const { documentId } = await req.json();
    if (!documentId) {
      console.error('Missing documentId in request');
      throw new Error('Document ID is required');
    }
    console.log('Processing document:', documentId);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!supabaseUrl || !supabaseKey || !openAIApiKey) {
      console.error('Missing required environment variables:', {
        hasSupabaseUrl: !!supabaseUrl,
        hasSupabaseKey: !!supabaseKey,
        hasOpenAIKey: !!openAIApiKey
      });
      throw new Error('Server configuration error: Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch document
    console.log('Fetching document from database...');
    const { data: document, error: documentError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (documentError) {
      console.error('Error fetching document:', documentError);
      throw new Error(`Document not found: ${documentError.message}`);
    }

    if (!document) {
      console.error('Document not found for ID:', documentId);
      throw new Error('Document not found');
    }

    // Download PDF file
    console.log('Downloading PDF file...');
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('pdfs')
      .download(document.file_path);

    if (downloadError || !fileData) {
      console.error('Error downloading file:', downloadError);
      throw new Error(`Failed to download PDF file: ${downloadError?.message || 'No file data'}`);
    }

    // Extract text from PDF
    console.log('Extracting text from PDF...');
    const fullText = await extractTextFromPdf(await fileData.arrayBuffer());
    const text = fullText.slice(0, 2000); // Limit text to prevent timeouts
    console.log('Text extracted, length:', text.length);

    if (text.length < 100) {
      console.error('Extracted text is too short:', text);
      throw new Error('Not enough text extracted from PDF (minimum 100 characters required)');
    }

    // Generate questions
    console.log('Generating questions...');
    const questions = await generateQuestions(text, documentId, openAIApiKey);
    console.log('Questions generated successfully:', questions);

    return new Response(
      JSON.stringify({ questions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-questions function:', error);
    console.error('Error stack:', error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});