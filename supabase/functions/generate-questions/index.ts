import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { extractTextFromPdf } from './pdfUtils.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting question generation process...');
    const { documentId } = await req.json();
    console.log('Processing document:', documentId);

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!supabaseUrl || !supabaseKey || !openAIApiKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch document with timeout
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

    // Get PDF content
    const { data: fileData, error: fileError } = await supabase
      .storage
      .from('pdfs')
      .download(document.file_path);

    if (fileError) {
      console.error('Error downloading file:', fileError);
      throw new Error('Could not download file');
    }

    const arrayBuffer = await fileData.arrayBuffer();
    console.log('PDF downloaded, size:', arrayBuffer.byteLength);

    // Extract first 2000 characters of text to keep processing quick
    const pdfText = await extractTextFromPdf(arrayBuffer);
    const truncatedText = pdfText.slice(0, 2000);
    console.log('Extracted and truncated text length:', truncatedText.length);

    // Generate only 3 questions to avoid timeouts
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
            content: `Generate exactly 3 questions based on the text. Format:
            {
              "questions": [
                {
                  "document_id": "${documentId}",
                  "course_name": "Name from content",
                  "chapter": "Chapter from content",
                  "topic": "Specific topic",
                  "difficulty": "easy/medium/advanced",
                  "question_text": "The question",
                  "type": "multiple-choice/single-choice/true-false",
                  "points": 5/10/15,
                  "answers": [
                    {
                      "text": "Answer text",
                      "isCorrect": true/false
                    }
                  ],
                  "feedback": "Explanation",
                  "metadata": {}
                }
              ]
            }`
          },
          {
            role: 'user',
            content: `Generate questions for this text: ${truncatedText}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
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
        console.error('Invalid response format:', parsedContent);
        throw new Error('Invalid response format from OpenAI');
      }

      // Validate questions
      parsedContent.questions.forEach((question: any, index: number) => {
        const requiredFields = [
          'document_id', 'course_name', 'chapter', 'topic', 'difficulty',
          'question_text', 'type', 'points', 'answers', 'feedback'
        ];
        
        for (const field of requiredFields) {
          if (!question[field]) {
            throw new Error(`Question ${index + 1} is missing required field: ${field}`);
          }
        }

        if (!Array.isArray(question.answers)) {
          throw new Error(`Question ${index + 1} has invalid answers format`);
        }
      });

      console.log('All questions validated successfully');
      return new Response(
        JSON.stringify({ questions: parsedContent.questions }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Error parsing or validating questions:', error);
      throw new Error(`Failed to parse generated questions: ${error.message}`);
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
