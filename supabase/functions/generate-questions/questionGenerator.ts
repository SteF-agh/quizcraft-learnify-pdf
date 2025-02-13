
import { GeneratedQuestion } from './types.ts';

const extractChapters = (content: string): string[] => {
  // Verbesserte Textaufteilung für mehr Kontext
  const paragraphs = content
    .split('\n\n')
    .filter(p => p.trim().length > 100) // Längere Abschnitte für besseren Kontext
    .map(p => p.replace(/\s+/g, ' ').trim()) // Bereinige Whitespace
    .slice(0, 3);
  
  console.log(`Extracted ${paragraphs.length} text sections with lengths:`, 
    paragraphs.map(p => p.length));
  return paragraphs;
};

export const generateQuestions = async (
  content: string,
  documentId: string,
  openAIApiKey: string
): Promise<GeneratedQuestion[]> => {
  console.log('Starting question generation with content length:', content.length);
  
  try {
    const chapters = extractChapters(content);
    const allQuestions: GeneratedQuestion[] = [];

    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      console.log(`\nProcessing section ${i + 1}/${chapters.length}`);
      console.log(`Section content preview: ${chapter.substring(0, 100)}...`);

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
                content: `Du bist ein Experte für die Erstellung von Prüfungsfragen. 
Erstelle EINE Multiple-Choice-Frage zu einem wichtigen Konzept aus dem Text.
Formatiere die Antwort EXAKT als folgendes JSON:
{
  "document_id": "${documentId}",
  "course_name": "KI-Kurs",
  "chapter": "Kapitel ${i + 1}",
  "topic": "Hauptthema des Abschnitts",
  "difficulty": "easy",
  "question_text": "Die Frage hier",
  "type": "multiple-choice",
  "points": 10,
  "answers": [
    {"text": "Erste Option", "isCorrect": false},
    {"text": "Korrekte Option", "isCorrect": true},
    {"text": "Dritte Option", "isCorrect": false}
  ],
  "feedback": "Erklärung, warum die Antwort korrekt ist"
}`
              },
              {
                role: 'user',
                content: `Erstelle eine Frage zu diesem Text:\n\n${chapter.slice(0, 800)}`
              }
            ],
            temperature: 0.5, // Reduzierte Temperatur für konsistentere Antworten
            max_tokens: 800
          }),
        });

        console.log('OpenAI API response status:', response.status);
        const responseText = await response.text();
        console.log('OpenAI API raw response:', responseText);

        if (!response.ok) {
          console.error(`OpenAI API error: ${response.status} ${response.statusText}`);
          continue;
        }

        const data = JSON.parse(responseText);
        if (!data.choices?.[0]?.message?.content) {
          console.error('Invalid response format from OpenAI');
          continue;
        }

        try {
          console.log('Attempting to parse question JSON:', data.choices[0].message.content);
          const question = JSON.parse(data.choices[0].message.content);
          
          // Validiere das Question-Objekt
          if (!question.question_text || !Array.isArray(question.answers)) {
            console.error('Invalid question format:', question);
            continue;
          }

          question.document_id = documentId;
          allQuestions.push(question);
          console.log(`Successfully generated and validated question ${i + 1}`);
        } catch (parseError) {
          console.error(`Error parsing question JSON:`, parseError);
          continue;
        }

        // Pause zwischen Anfragen
        if (i < chapters.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

      } catch (error) {
        console.error(`Error processing section ${i + 1}:`, error);
        continue;
      }
    }

    console.log(`Generation complete. Generated ${allQuestions.length} questions:`, 
      JSON.stringify(allQuestions, null, 2));
    return allQuestions;
  } catch (error) {
    console.error('Error in question generation:', error);
    throw error;
  }
};
