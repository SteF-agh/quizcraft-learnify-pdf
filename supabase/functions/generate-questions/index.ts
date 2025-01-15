import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { decode } from 'https://deno.land/std@0.177.0/encoding/base64.ts';

interface Question {
  type: 'multiple-choice' | 'true-false' | 'open' | 'matching' | 'fill-in';
  text: string;
  options?: string[];
  correctAnswer: string | number | boolean;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentId, questionType } = await req.json();
    console.log('Received request for document:', documentId, 'questionType:', questionType);

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get document details
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
    const bytes = new Uint8Array(arrayBuffer);
    const text = new TextDecoder().decode(bytes);
    console.log('Successfully extracted text from PDF, length:', text.length);

    // Generate questions using GPT-4
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a professional educator who creates diverse quiz questions based on provided text content. 
            ${questionType === 'all' 
              ? 'Create a mix of different question types'
              : `Create only ${questionType} questions`}.
            
            Return ONLY a JSON array of questions, where each question object has this exact structure:
            {
              "type": "multiple-choice" | "true-false" | "open" | "matching" | "fill-in",
              "text": "question text here",
              "options": ["array", "of", "options"] (only for multiple-choice, matching),
              "correctAnswer": number (index for multiple-choice/matching) | boolean (for true-false) | string (for open/fill-in)
            }
            
            Make sure all questions are directly related to the content provided and use specific details from the text.
            Do not include any markdown formatting, just the raw JSON array.
            Ensure questions test understanding of key concepts from the text.`
          },
          {
            role: "user",
            content: `Generate 5 ${questionType === 'all' ? 'diverse' : questionType} questions from this text content: ${text.substring(0, 4000)}`
          }
        ]
      })
    });

    const gptResponse = await response.json();
    console.log('Received GPT response:', gptResponse);

    if (!gptResponse.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from GPT');
    }

    let questions: Question[];
    try {
      const content = gptResponse.choices[0].message.content.trim();
      questions = JSON.parse(content);
      
      if (!Array.isArray(questions)) {
        throw new Error('Response is not an array');
      }
      
      // Validate each question
      questions.forEach((q, index) => {
        if (!q.type || !q.text || (q.type === 'multiple-choice' && !Array.isArray(q.options))) {
          throw new Error(`Invalid question format at index ${index}`);
        }
      });

      console.log('Successfully validated questions format');
    } catch (error) {
      console.error('Error parsing GPT response:', error);
      throw new Error('Failed to parse questions from GPT response');
    }

    console.log('Successfully generated questions:', questions);

    return new Response(
      JSON.stringify({ questions }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in generate-questions function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});