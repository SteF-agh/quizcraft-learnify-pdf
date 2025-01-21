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
    const fetchPromise = supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Document fetch timeout')), 5000)
    );

    const { data: document, error: docError } = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]);

    if (docError || !document) {
      console.error('Document not found:', docError);
      throw new Error('Document not found');
    }

    console.log('Found document:', document.name);

    // Get PDF content with timeout
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

    const pdfText = await extractTextFromPdf(arrayBuffer);
    console.log('Extracted text length:', pdfText.length);

    if (!pdfText || pdfText.length < 100) {
      throw new Error('Could not extract meaningful text from PDF');
    }

    // Split text into chunks to avoid token limits
    const maxChunkLength = 4000;
    const textChunks = [];
    for (let i = 0; i < pdfText.length; i += maxChunkLength) {
      textChunks.push(pdfText.slice(i, i + maxChunkLength));
    }
    console.log('Split text into', textChunks.length, 'chunks');

    // Process first chunk only for initial questions
    const chunk = textChunks[0];
    console.log('Processing first chunk, length:', chunk.length);

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
            content: `Du bist ein Experte für die Erstellung von Prüfungsfragen. Erstelle genau 3 Fragen basierend auf dem Text.
            Format der Antwort MUSS exakt sein:
            {
              "questions": [
                {
                  "document_id": "${documentId}",
                  "course_name": "Name des Kurses aus dem Inhalt",
                  "chapter": "Kapitelnummer und -name",
                  "topic": "Spezifisches Thema",
                  "difficulty": "easy/medium/advanced",
                  "question_text": "Die Frage",
                  "type": "multiple-choice/single-choice/true-false",
                  "points": 5/10/15,
                  "answers": [
                    {
                      "text": "Antworttext",
                      "isCorrect": true/false
                    }
                  ],
                  "feedback": "Erklärung",
                  "metadata": {}
                }
              ]
            }`
          },
          {
            role: 'user',
            content: `Erstelle Fragen zu diesem Text: ${chunk}`
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
        console.log(`Validating question ${index + 1}`);
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

        // Validate answers based on question type
        if (question.type === 'true-false' && question.answers.length !== 2) {
          throw new Error(`Question ${index + 1} (true-false) must have exactly 2 answers`);
        }

        if (['multiple-choice', 'single-choice'].includes(question.type) && question.answers.length !== 4) {
          throw new Error(`Question ${index + 1} (${question.type}) must have exactly 4 answers`);
        }

        // Validate correct answers
        if (['single-choice', 'true-false'].includes(question.type)) {
          const correctAnswers = question.answers.filter((a: any) => a.isCorrect);
          if (correctAnswers.length !== 1) {
            throw new Error(`Question ${index + 1} must have exactly one correct answer`);
          }
        }

        if (question.type === 'multiple-choice') {
          const correctAnswers = question.answers.filter((a: any) => a.isCorrect);
          if (correctAnswers.length === 0) {
            throw new Error(`Question ${index + 1} must have at least one correct answer`);
          }
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