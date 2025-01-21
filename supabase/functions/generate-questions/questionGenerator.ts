interface QuestionGeneratorOptions {
  documentName: string;
  documentId: string;
  content: string;
}

export const generateQuestions = async (
  options: QuestionGeneratorOptions,
  openAIApiKey: string
): Promise<any> => {
  console.log('Calling OpenAI API...');
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: `Du bist ein Experte für die Erstellung von Prüfungsfragen. Generiere genau 10 Fragen pro Kapitel basierend auf dem bereitgestellten Inhalt. Gib sie als Array von Objekten mit folgender EXAKTER Struktur zurück:

{
  "questions": [
    {
      "document_id": "string (from input)",
      "course_name": "string (extract from content)",
      "chapter": "string (extract from content)",
      "topic": "string (extract from content)",
      "difficulty": "easy" | "medium" | "advanced",
      "question_text": "string (in German)",
      "type": "multiple-choice" | "single-choice" | "true-false",
      "points": number,
      "answers": [
        {
          "text": "string (in German)",
          "isCorrect": boolean
        }
      ],
      "feedback": "string (in German)",
      "metadata": {}
    }
  ]
}

Richtlinien:
1. Fragen pro Kapitel:
   - 4 einfache Fragen (5 Punkte)
   - 3 mittelschwere Fragen (10 Punkte)
   - 3 schwere Fragen (15 Punkte)

2. Fragetypen:
   - 40% Multiple-Choice (4 Optionen, eine richtig)
   - 40% Single-Choice (4 Optionen, eine richtig)
   - 20% Wahr/Falsch (2 Optionen)
   - Richtige Antwort zufällig positionieren

3. Qualitätsrichtlinien:
   - Fragen müssen sich DIREKT auf den Inhalt des Dokuments beziehen
   - Fragen müssen klar und eindeutig sein
   - Antworten müssen unmissverständlich sein
   - Hilfreiches Feedback bei jeder Frage geben
   - Keine Duplikate
   - Fragen gleichmäßig über alle Kapitel verteilen

4. Antwortformat:
   - Multiple/Single Choice: Genau 4 Optionen
   - Wahr/Falsch: Genau 2 Optionen
   - Zufällige Position der richtigen Antwort`
          },
          { 
            role: 'user', 
            content: `Generiere Fragen basierend auf diesem Inhalt: ${options.content.substring(0, 4000)}

Document ID: ${options.documentId}
Document Name: ${options.documentName}`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

    try {
      const parsedContent = JSON.parse(data.choices[0].message.content);
      console.log('Successfully parsed OpenAI response');
      
      if (!parsedContent.questions || !Array.isArray(parsedContent.questions)) {
        console.error('Invalid response format:', parsedContent);
        throw new Error('Invalid response format from OpenAI');
      }
      
      // Validate the structure of each question
      parsedContent.questions.forEach((question: any, index: number) => {
        console.log(`Validating question ${index + 1}:`, question);
        
        if (!question.document_id || 
            !question.course_name ||
            !question.chapter ||
            !question.topic ||
            !question.difficulty ||
            !question.question_text ||
            !question.type ||
            !question.points ||
            !Array.isArray(question.answers) ||
            !question.feedback) {
          throw new Error(`Question ${index + 1} is missing required fields`);
        }

        // Validate difficulty
        if (!['easy', 'medium', 'advanced'].includes(question.difficulty)) {
          throw new Error(`Question ${index + 1} has invalid difficulty: ${question.difficulty}`);
        }

        // Validate type and number of answers
        if (['multiple-choice', 'single-choice'].includes(question.type) && question.answers.length !== 4) {
          throw new Error(`Question ${index + 1} should have exactly 4 options`);
        }
        if (question.type === 'true-false' && question.answers.length !== 2) {
          throw new Error(`Question ${index + 1} should have exactly 2 options`);
        }
      });
      
      return parsedContent.questions;
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      console.error('Raw content:', data.choices[0].message.content);
      throw new Error('Failed to parse generated questions');
    }
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
};