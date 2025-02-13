
import { GeneratedQuestion } from './types.ts';

const extractChapters = (content: string): string[] => {
  // Teilt den Text bei Überschriften auf (z.B. "Kapitel X", "1.", "I.", etc.)
  const chapters = content
    .split(/(?=Kapitel|Abschnitt|\d+\.|[IVX]+\.)/g)
    .filter(chapter => chapter.trim().length > 100)
    .slice(0, 5); // Maximal 5 Kapitel zur Verarbeitung

  console.log(`Found ${chapters.length} chapters in content`);
  return chapters;
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

    // Verarbeite jedes Kapitel einzeln
    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      console.log(`Processing chapter ${i + 1} of ${chapters.length}, length: ${chapter.length}`);

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
                content: `Du bist ein Experte für die Erstellung von Prüfungsfragen. Erstelle EINE Multiple-Choice-Frage basierend auf dem folgenden Textabschnitt. Die Frage sollte das Verständnis des Hauptkonzepts testen. Formatiere die Antwort als JSON-Objekt mit dieser Struktur:
{
  "document_id": "${documentId}",
  "course_name": "Aus dem Inhalt extrahiert",
  "chapter": "Kapitel ${i + 1}",
  "topic": "Hauptthema aus dem Text",
  "difficulty": "easy",
  "question_text": "Frage auf Deutsch",
  "type": "multiple-choice",
  "points": 10,
  "answers": [
    {"text": "Option 1", "isCorrect": false},
    {"text": "Option 2", "isCorrect": true},
    {"text": "Option 3", "isCorrect": false}
  ],
  "feedback": "Erklärung auf Deutsch, warum die Antwort korrekt ist"}`
              },
              {
                role: 'user',
                content: chapter.slice(0, 1500) // Begrenzt die Textlänge pro Request
              }
            ],
            max_tokens: 500, // Reduzierte Token-Anzahl
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`Successfully generated question for chapter ${i + 1}`);
        
        try {
          const question = JSON.parse(data.choices[0].message.content);
          allQuestions.push(question);
        } catch (error) {
          console.error(`Error parsing question for chapter ${i + 1}:`, error);
          // Fahre mit dem nächsten Kapitel fort, auch wenn dieses fehlschlägt
        }

        // Warte kurz zwischen den Anfragen, um Rate Limits zu vermeiden
        if (i < chapters.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } catch (error) {
        console.error(`Error processing chapter ${i + 1}:`, error);
        // Fahre mit dem nächsten Kapitel fort, auch wenn dieses fehlschlägt
      }
    }

    console.log(`Successfully generated ${allQuestions.length} questions`);
    return allQuestions;
  } catch (error) {
    console.error('Error in question generation:', error);
    throw error;
  }
};
