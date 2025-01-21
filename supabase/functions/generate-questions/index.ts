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
    const { documentId } = await req.json();
    console.log('Processing document:', documentId);

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!supabaseUrl || !supabaseKey || !openAIApiKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch document
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
    const pdfText = await extractTextFromPdf(arrayBuffer);
    console.log('Successfully extracted text from PDF, length:', pdfText.length);

    // Call OpenAI API
    console.log('Calling OpenAI API...');
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
            content: `You are an expert at creating exam questions. Analyze the provided text and create relevant questions.
            Important rules:
            1. Create exactly 5 questions per identified chapter
            2. Questions MUST be DIRECTLY related to the content
            3. No general or superficial questions
            4. Each question must test a specific concept or important information from the text
            5. For Multiple-Choice: All answer options must be plausible
            6. Provide helpful, explanatory feedback
            7. Distribute difficulty levels: 2 easy, 2 medium, 1 hard per chapter

            Return the questions in this EXACT format:
            {
              "questions": [
                {
                  "document_id": "${documentId}",
                  "course_name": "Name of the course from the content",
                  "chapter": "Chapter number and name",
                  "topic": "Specific topic of the question",
                  "difficulty": "easy/medium/advanced",
                  "question_text": "The actual question",
                  "type": "multiple-choice/single-choice/true-false",
                  "points": "5 for easy, 10 for medium, 15 for advanced",
                  "answers": [
                    {
                      "text": "Answer text",
                      "isCorrect": true/false
                    }
                  ],
                  "feedback": "Detailed explanation of the correct answer",
                  "metadata": {}
                }
              ]
            }`
          },
          {
            role: 'user',
            content: `Create questions based on this text: ${pdfText.substring(0, 8000)}`
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
    console.log('Received response from OpenAI:', data);

    try {
      const parsedContent = JSON.parse(data.choices[0].message.content);
      console.log('Successfully parsed OpenAI response:', parsedContent);
      
      if (!parsedContent.questions || !Array.isArray(parsedContent.questions)) {
        console.error('Invalid response format:', parsedContent);
        throw new Error('Invalid response format from OpenAI');
      }

      // Validate each question
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

        if (question.type === 'true-false' && question.answers.length !== 2) {
          throw new Error(`Question ${index + 1} (true-false) must have exactly 2 answers`);
        }

        if (['multiple-choice', 'single-choice'].includes(question.type) && question.answers.length !== 4) {
          throw new Error(`Question ${index + 1} (${question.type}) must have exactly 4 answers`);
        }
      });

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