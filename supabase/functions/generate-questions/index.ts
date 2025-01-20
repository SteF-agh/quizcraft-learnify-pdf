import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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
    const { documentId } = await req.json();
    console.log('Generating questions for document:', documentId);

    // Initialize Supabase client with environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration');
      throw new Error('Missing Supabase configuration');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

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

    // Convert PDF to text
    const arrayBuffer = await fileData.arrayBuffer();
    const text = new TextDecoder().decode(new Uint8Array(arrayBuffer));
    console.log('Successfully extracted text from PDF, length:', text.length);

    // Call OpenAI API to generate questions
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are an expert in creating educational quiz questions. Generate exactly 5 questions based on the provided content, following these guidelines:

1. Question Distribution:
   - 2 easy questions
   - 2 medium questions
   - 1 advanced question

2. Question Types:
   - Mix of multiple-choice and true-false questions
   - For multiple-choice, provide exactly 4 options
   - Make sure exactly one answer is correct

3. Quality Guidelines:
   - Questions should be clear and concise
   - Answers should be unambiguous
   - Include helpful feedback for each question

Format your response EXACTLY as this JSON structure:
{
  "questions": [{
    "courseName": "${document.name}",
    "chapter": "chapter-1",
    "topic": "main-topic",
    "difficulty": "easy|medium|advanced",
    "questionText": "What is...?",
    "type": "multiple-choice|true-false",
    "points": 10,
    "answers": [{"text": "answer text", "isCorrect": boolean}],
    "feedback": "explanation why the answer is correct",
    "learningObjectiveId": null,
    "metadata": {},
    "documentId": "${documentId}"
  }]
}`;

    console.log('Calling OpenAI API...');
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
          { role: 'user', content: `Generate questions based on this content: ${text.substring(0, 4000)}` }
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