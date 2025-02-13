
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { generateQuestions } from './questionGenerator.ts';
import { extractTextFromPdf } from './pdfUtils.ts';

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
    // Parse request body
    const { documentId } = await req.json();
    console.log('Received request for document:', documentId);
    
    if (!documentId) {
      console.error('No document ID provided');
      return new Response(
        JSON.stringify({ error: 'Document ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!supabaseUrl || !supabaseKey || !openAIApiKey) {
      console.error('Missing environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch document
    console.log('Fetching document metadata...');
    const { data: document, error: documentError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (documentError) {
      console.error('Error fetching document:', documentError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch document metadata' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!document) {
      console.error('Document not found:', documentId);
      return new Response(
        JSON.stringify({ error: 'Document not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Download PDF
    console.log('Downloading PDF file...');
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('pdfs')
      .download(document.file_path);

    if (downloadError) {
      console.error('Error downloading PDF:', downloadError);
      return new Response(
        JSON.stringify({ error: 'Failed to download PDF file' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!fileData) {
      console.error('No file data received');
      return new Response(
        JSON.stringify({ error: 'PDF file is empty' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Extract text from PDF
    console.log('Starting text extraction...');
    let fullText: string;
    try {
      fullText = await extractTextFromPdf(await fileData.arrayBuffer());
      console.log('Text extraction complete, length:', fullText.length);
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to extract text from PDF' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Generate questions
    console.log('Starting question generation...');
    try {
      const questions = await generateQuestions(fullText, documentId, openAIApiKey);
      console.log(`Generated ${questions.length} questions successfully`);
      
      return new Response(
        JSON.stringify({ 
          success: true,
          questions,
          message: `Successfully generated ${questions.length} questions`
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } catch (error) {
      console.error('Error generating questions:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to generate questions',
          details: error.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
