
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
      throw new Error('Document not found');
    }

    // Download PDF
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('pdfs')
      .download(document.file_path);

    if (downloadError || !fileData) {
      throw new Error('Failed to download PDF file');
    }

    // Extract text from PDF
    const fullText = await extractTextFromPdf(await fileData.arrayBuffer());
    console.log('Extracted text length:', fullText.length);

    // Split text into chunks of approximately 2000 characters
    const chunks = [];
    const chunkSize = 2000;
    for (let i = 0; i < fullText.length; i += chunkSize) {
      chunks.push(fullText.slice(i, i + chunkSize));
    }

    // Generate questions for each chunk
    const allQuestions = [];
    for (let i = 0; i < Math.min(chunks.length, 3); i++) { // Limit to 3 chunks for now
      const chunk = chunks[i];
      console.log(`Processing chunk ${i + 1} of ${chunks.length}`);

      try {
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
                content: `Generate THREE multiple choice questions based on this text. Return them as a JSON array with this structure for each question:
                {
                  "document_id": "${documentId}",
                  "course_name": "Extracted from content",
                  "chapter": "Chapter ${i + 1}",
                  "topic": "Main topic from text",
                  "difficulty": "easy | medium | advanced",
                  "question_text": "Question in German",
                  "type": "multiple-choice",
                  "points": 10,
                  "answers": [
                    {"text": "Option 1", "isCorrect": false},
                    {"text": "Option 2", "isCorrect": true},
                    {"text": "Option 3", "isCorrect": false},
                    {"text": "Option 4", "isCorrect": false}
                  ],
                  "feedback": "Feedback in German explaining the correct answer"
                }`
              },
              {
                role: 'user',
                content: chunk
              }
            ],
            max_tokens: 2000,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.statusText}`);
        }

        const data = await response.json();
        const questions = JSON.parse(data.choices[0].message.content);
        allQuestions.push(...questions);

      } catch (error) {
        console.error(`Error processing chunk ${i}:`, error);
        // Continue with next chunk even if this one fails
      }
    }

    console.log(`Generated ${allQuestions.length} questions successfully`);
    
    return new Response(
      JSON.stringify({ questions: allQuestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

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
