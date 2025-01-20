import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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

    // Call OpenAI API to generate questions
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are an expert in creating educational quiz questions. Follow these instructions precisely:

1. Script Parameters:
   - Generate a complete set of questions:
     - 10 easy, 10 medium, and 10 advanced questions per chapter
     - Questions should be proportionally distributed across the entire script

2. Question Formats:
   - 40% Multiple Choice (4 options)
   - 40% Single Choice (4 options)
   - 20% True/False
   - Position correct answers randomly and evenly across A, B, C, D

3. For each question, provide:
   - Question text
   - Question type
   - Difficulty level
   - All possible answers
   - Correct answer(s)
   - Brief feedback explaining the correct answer
   - Chapter/topic reference

Format your response as a JSON array of questions following this structure:
{
  "questions": [{
    "courseName": "${document.name}",
    "chapter": "chapter-name",
    "topic": "specific-topic",
    "difficulty": "easy|medium|advanced",
    "questionText": "question-text",
    "type": "multiple-choice|single-choice|true-false",
    "points": 10,
    "answers": [{"text": "answer-text", "isCorrect": boolean}],
    "feedback": "explanation-text",
    "learningObjectiveId": null,
    "metadata": {},
    "documentId": "${documentId}"
  }]
}`;

    console.log('Sending request to OpenAI...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Generate questions based on this content: ${text.substring(0, 8000)}` // Limit content length
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate questions');
    }

    const data = await response.json();
    console.log('OpenAI response received');

    let generatedQuestions;
    try {
      const parsedContent = JSON.parse(data.choices[0].message.content);
      console.log('Successfully parsed OpenAI response');
      
      if (!parsedContent.questions || !Array.isArray(parsedContent.questions)) {
        console.error('Invalid response format:', parsedContent);
        throw new Error('Invalid response format from OpenAI');
      }
      
      generatedQuestions = parsedContent.questions;
      console.log(`Successfully extracted ${generatedQuestions.length} questions`);
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      console.error('Raw content:', data.choices[0].message.content);
      throw new Error('Failed to parse generated questions');
    }

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
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});