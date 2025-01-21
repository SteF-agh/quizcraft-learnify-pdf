import { GeneratedQuestion } from './types.ts';

export const generateQuestions = async (
  content: string,
  documentId: string,
  openAIApiKey: string
): Promise<GeneratedQuestion[]> => {
  console.log('Calling OpenAI API with content length:', content.length);
  
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
            content: `Generate exactly 3 questions based on the provided content. Return them as an array of objects with this EXACT structure:
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
      "feedback": "string (in German)"
    }
  ]
}`
          },
          { 
            role: 'user', 
            content: `Generate questions based on this content: ${content}
Document ID: ${documentId}`
          }
        ],
        max_tokens: 1000,
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
      
      // Validate each question
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