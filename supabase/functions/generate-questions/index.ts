
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
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
    console.log('Starting question generation process...');
    
    const { documentId } = await req.json();
    if (!documentId) {
      throw new Error('Document ID is required');
    }

    console.log('Processing document:', documentId);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!supabaseUrl || !supabaseKey || !openAIApiKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch document
    const { data: document, error: documentError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (documentError || !document) {
      console.error('Error fetching document:', documentError);
      throw new Error('Document not found');
    }

    console.log('Document found:', document.name);

    // Download PDF
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('pdfs')
      .download(document.file_path);

    if (downloadError || !fileData) {
      console.error('Error downloading PDF:', downloadError);
      throw new Error('Failed to download PDF file');
    }

    console.log('PDF downloaded successfully');

    try {
      // Extract text from PDF (first 2000 characters only)
      const fullText = await extractTextFromPdf(await fileData.arrayBuffer());
      const truncatedText = fullText.slice(0, 2000);

      console.log('Text extracted, length:', truncatedText.length);

      // Generate questions using OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Generate ONE multiple choice question based on this text. Return it as a JSON object with this structure:
                {
                  "document_id": "${documentId}",
                  "course_name": "Extracted from content",
                  "chapter": "Chapter 1",
                  "topic": "Main topic from text",
                  "difficulty": "easy",
                  "question_text": "Question in German",
                  "type": "multiple-choice",
                  "points": 10,
                  "answers": [
                    {"text": "Option 1", "isCorrect": false},
                    {"text": "Option 2", "isCorrect": true},
                    {"text": "Option 3", "isCorrect": false}
                  ],
                  "feedback": "Feedback in German"
                }`
            },
            {
              role: 'user',
              content: truncatedText
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        console.error('OpenAI API error:', await response.text());
        throw new Error('OpenAI API error');
      }

      const data = await response.json();
      console.log('OpenAI response received');

      try {
        const question = JSON.parse(data.choices[0].message.content);
        console.log('Question generated successfully');
        
        return new Response(
          JSON.stringify({ questions: [question] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error('Error parsing question:', error);
        throw new Error('Failed to parse question from OpenAI response');
      }
    } catch (error) {
      console.error('Error in text extraction or question generation:', error);
      throw error;
    }

  } catch (error) {
    console.error('Error in generate-questions function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
