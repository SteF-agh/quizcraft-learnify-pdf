
import { GeneratedQuestion } from './types.ts';

const extractChapters = (content: string): string[] => {
  // Vereinfachte Kapitelextraktion
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
  const chapters = paragraphs.slice(0, 3); // Reduziert auf maximal 3 Abschnitte
  
  console.log(`Extracted ${chapters.length} text sections`);
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

    // Verarbeite jeden Abschnitt einzeln
    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      console.log(`Processing section ${i + 1} of ${chapters.length}`);

      try {
        const prompt = `Erstelle eine Multiple-Choice-Frage zu diesem Text: ${chapter.slice(0, 1000)}`;
        
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
                content: 'Erstelle eine Multiple-Choice-Frage im folgenden JSON-Format: {"document_id": "ID", "course_name": "Name", "chapter": "Kapitel", "topic": "Thema", "difficulty": "easy", "question_text": "Frage", "type": "multiple-choice", "points": 10, "answers": [{"text": "A", "isCorrect": false}, {"text": "B", "isCorrect": true}, {"text": "C", "isCorrect": false}], "feedback": "Erklärung"}'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 400
          }),
        });

        if (!response.ok) {
          console.error(`OpenAI API error: ${response.statusText}`);
          continue;
        }

        const data = await response.json();
        if (!data.choices?.[0]?.message?.content) {
          console.error('Invalid response format from OpenAI');
          continue;
        }

        try {
          const question = JSON.parse(data.choices[0].message.content);
          question.document_id = documentId; // Stelle sicher, dass die document_id korrekt ist
          allQuestions.push(question);
          console.log(`Successfully generated question ${i + 1}`);
        } catch (parseError) {
          console.error(`Error parsing question JSON:`, parseError);
          continue;
        }

        // Kurze Pause zwischen den Anfragen
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error processing section ${i + 1}:`, error);
        continue;
      }
    }

    console.log(`Successfully generated ${allQuestions.length} questions`);
    return allQuestions;
  } catch (error) {
    console.error('Error in question generation:', error);
    throw error;
  }
};
