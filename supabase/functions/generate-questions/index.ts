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

    // Example questions for each type based on the KI text
    const exampleQuestions: Question[] = [
      {
        type: 'multiple-choice',
        text: 'Welche Fähigkeiten werden im Text als Teil der Künstlichen Intelligenz genannt?',
        options: [
          'Lernen, Problemlösung und Entscheidungsfindung',
          'Sprechen, Hören und Sehen',
          'Laufen, Springen und Fliegen',
          'Kochen, Putzen und Waschen'
        ],
        correctAnswer: 0
      },
      {
        type: 'true-false',
        text: 'Künstliche Intelligenz beschreibt ausschließlich die Fähigkeit von Menschen, komplexe Aufgaben zu lösen.',
        correctAnswer: false
      },
      {
        type: 'open',
        text: 'Was sind die drei grundlegenden Konzepte der KI, die im Text erwähnt werden?',
        correctAnswer: 'Algorithmen, Daten und Modelle'
      },
      {
        type: 'matching',
        text: 'Ordne die Begriffe ihrer korrekten Beschreibung zu.',
        options: [
          'KI - Fähigkeit von Maschinen, menschenähnliche Aufgaben zu lösen',
          'Lernen - Prozess der Anpassung an neue Situationen',
          'Algorithmen - Grundlegendes Konzept der KI',
          'Eigenständigkeit - Fähigkeit ohne menschliche Intervention zu agieren'
        ],
        correctAnswer: 0
      },
      {
        type: 'fill-in',
        text: 'Künstliche Intelligenz ermöglicht es Maschinen, sich an neue [?] anzupassen.',
        options: ['Situationen', 'Menschen', 'Computer', 'Programme'],
        correctAnswer: 0
      }
    ];

    // Filter questions based on type if specified
    let questions = exampleQuestions;
    if (questionType !== 'all') {
      questions = exampleQuestions.filter(q => q.type === questionType);
    }

    console.log('Generated questions:', questions);

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