import { GeneratedQuestion } from './types.ts';

export const generateQuestions = async (
  content: string,
  documentId: string,
  openAIApiKey: string
): Promise<GeneratedQuestion[]> => {
  console.log('Starting question generation with content length:', content.length);
  
  try {
    // Teile den Text in kleinere Abschnitte
    const sections = content
      .split('\n\n')
      .filter(section => section.trim().length > 50)
      .slice(0, 3); // Maximal 3 Abschnitte

    console.log(`Processing ${sections.length} content sections`);

    // Generiere eine Frage pro Abschnitt
    const questions = await Promise.all(sections.map(async (section, index) => {
      console.log(`Generating question for section ${index + 1}`);
      
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
              content: `Generate ONE question based on this text section. Return it as a JSON object with this structure:
{
  "document_id": "${documentId}",
  "course_name": "Extracted from content",
  "chapter": "Section ${index + 1}",
  "topic": "Main topic from section",
  "difficulty": "easy",
  "question_text": "Question in German",
  "type": "multiple-choice",
  "points": 10,
  "answers": [
    {"text": "Option 1", "isCorrect": false},
    {"text": "Option 2", "isCorrect": true},
    {"text": "Option 3", "isCorrect": false}
  ],
  "feedback": "Feedback in German"
}`
            },
            {
              role: 'user',
              content: section
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`Successfully generated question for section ${index + 1}`);
      
      try {
        const question = JSON.parse(data.choices[0].message.content);
        return question;
      } catch (error) {
        console.error(`Error parsing question for section ${index + 1}:`, error);
        throw new Error(`Failed to parse question: ${error.message}`);
      }
    }));

    console.log('Successfully generated all questions');
    return questions;
  } catch (error) {
    console.error('Error in question generation:', error);
    throw error;
  }
};