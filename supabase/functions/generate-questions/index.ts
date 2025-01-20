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
    console.log('Processing document:', documentId);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Get document
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

    // Generate sample questions without PDF processing
    const sampleQuestions = [
      {
        documentId: document.id,
        courseName: "Sample Course",
        chapter: "Chapter 1",
        topic: "Introduction",
        difficulty: "easy",
        questionText: "Was ist der Hauptzweck dieses Dokuments?",
        type: "multiple-choice",
        points: 5,
        answers: [
          { text: "Information vermitteln", isCorrect: true },
          { text: "Unterhaltung bieten", isCorrect: false },
          { text: "Werbung machen", isCorrect: false },
          { text: "Kritik üben", isCorrect: false }
        ],
        feedback: "Der Hauptzweck eines Lehrdokuments ist es, Information zu vermitteln."
      },
      {
        documentId: document.id,
        courseName: "Sample Course",
        chapter: "Chapter 1",
        topic: "Basics",
        difficulty: "easy",
        questionText: "Ist es wichtig, den Inhalt dieses Dokuments zu verstehen?",
        type: "true-false",
        points: 5,
        answers: [
          { text: "Ja", isCorrect: true },
          { text: "Nein", isCorrect: false }
        ],
        feedback: "Das Verständnis des Inhalts ist grundlegend für den Lernprozess."
      },
      {
        documentId: document.id,
        courseName: "Sample Course",
        chapter: "Chapter 2",
        topic: "Core Concepts",
        difficulty: "medium",
        questionText: "Welche der folgenden Aussagen trifft am besten zu?",
        type: "multiple-choice",
        points: 10,
        answers: [
          { text: "Lernen ist ein kontinuierlicher Prozess", isCorrect: true },
          { text: "Einmaliges Lesen reicht aus", isCorrect: false },
          { text: "Wiederholung ist unwichtig", isCorrect: false },
          { text: "Prüfungen sind unnötig", isCorrect: false }
        ],
        feedback: "Lernen ist ein kontinuierlicher Prozess, der Wiederholung und Übung erfordert."
      },
      {
        documentId: document.id,
        courseName: "Sample Course",
        chapter: "Chapter 2",
        topic: "Advanced Topics",
        difficulty: "medium",
        questionText: "Welche Lernmethode ist am effektivsten?",
        type: "multiple-choice",
        points: 10,
        answers: [
          { text: "Aktives Lernen mit Selbstreflexion", isCorrect: true },
          { text: "Passives Lesen", isCorrect: false },
          { text: "Auswendiglernen", isCorrect: false },
          { text: "Nur Zuhören", isCorrect: false }
        ],
        feedback: "Aktives Lernen mit Selbstreflexion führt zu besserem Verständnis und längerer Behaltenszeit."
      },
      {
        documentId: document.id,
        courseName: "Sample Course",
        chapter: "Chapter 3",
        topic: "Expert Level",
        difficulty: "advanced",
        questionText: "Was ist der wichtigste Aspekt beim Lernen?",
        type: "multiple-choice",
        points: 15,
        answers: [
          { text: "Regelmäßige Selbstevaluation", isCorrect: true },
          { text: "Schnelles Durchlesen", isCorrect: false },
          { text: "Keine Pausen machen", isCorrect: false },
          { text: "Alleine lernen", isCorrect: false }
        ],
        feedback: "Regelmäßige Selbstevaluation hilft, den eigenen Lernfortschritt zu überwachen und anzupassen."
      }
    ];

    return new Response(
      JSON.stringify({ questions: sampleQuestions }),
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