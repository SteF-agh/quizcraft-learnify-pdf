import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Question {
  type: 'multiple-choice' | 'true-false' | 'open' | 'matching' | 'fill-in';
  text: string;
  options?: string[];
  correctAnswer: string | number | boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { documentId } = await req.json();

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
      throw new Error('Document not found');
    }

    // Download PDF content
    const { data: fileData, error: downloadError } = await supabaseClient
      .storage
      .from('pdfs')
      .download(document.file_path);

    if (downloadError) {
      throw new Error('Error downloading PDF');
    }

    // Convert PDF to text (basic example - you might want to use a PDF parsing library)
    const text = await fileData.text();

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
            content: `You are a professional educator who creates diverse quiz questions. 
            Create a mix of different question types from the provided text:
            - Multiple choice questions
            - True/False questions
            - Open questions
            - Matching questions
            - Fill-in-the-blank questions
            
            Format your response as a JSON array of questions, where each question has:
            {
              type: "multiple-choice" | "true-false" | "open" | "matching" | "fill-in",
              text: string,
              options?: string[],
              correctAnswer: string | number | boolean
            }`
          },
          {
            role: "user",
            content: `Generate 5 diverse questions from this text: ${text.substring(0, 4000)}` // Limit text length
          }
        ]
      })
    });

    const gptResponse = await response.json();
    const questions = JSON.parse(gptResponse.choices[0].message.content);

    return new Response(
      JSON.stringify({ questions }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});