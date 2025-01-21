import { GeneratedQuestion } from './types.ts';

export const generateQuestions = async (
  content: string,
  documentId: string,
  openAIApiKey: string
): Promise<GeneratedQuestion[]> => {
  console.log('Starting OpenAI request with content length:', content.length);
  
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
      console.error('OpenAI API error response:', error);
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

    try {
      const parsedContent = JSON.parse(data.choices[0].message.content);
      console.log('Successfully parsed OpenAI response:', parsedContent);
      
      if (!parsedContent.questions || !Array.isArray(parsedContent.questions)) {
        console.error('Invalid response format:', parsedContent);
        throw new Error('Invalid response format from OpenAI');
      }
      
      // Validate each question
      parsedContent.questions.forEach((question: any, index: number) => {
        console.log(`Validating question ${index + 1}:`, question);
        
        const requiredFields = [
          'document_id',
          'course_name',
          'chapter',
          'topic',
          'difficulty',
          'question_text',
          'type',
          'points',
          'answers',
          'feedback'
        ];

        const missingFields = requiredFields.filter(field => !question[field]);
        if (missingFields.length > 0) {
          throw new Error(`Question ${index + 1} is missing required fields: ${missingFields.join(', ')}`);
        }

        // Validate difficulty
        if (!['easy', 'medium', 'advanced'].includes(question.difficulty)) {
          throw new Error(`Question ${index + 1} has invalid difficulty: ${question.difficulty}`);
        }

        // Validate type and number of answers
        if (!['multiple-choice', 'single-choice', 'true-false'].includes(question.type)) {
          throw new Error(`Question ${index + 1} has invalid type: ${question.type}`);
        }

        if (['multiple-choice', 'single-choice'].includes(question.type) && question.answers.length < 2) {
          throw new Error(`Question ${index + 1} should have at least 2 options`);
        }

        if (question.type === 'true-false' && question.answers.length !== 2) {
          throw new Error(`Question ${index + 1} should have exactly 2 options for true-false`);
        }

        // Validate that at least one answer is correct
        const hasCorrectAnswer = question.answers.some((answer: any) => answer.isCorrect);
        if (!hasCorrectAnswer) {
          throw new Error(`Question ${index + 1} must have at least one correct answer`);
        }
      });
      
      return parsedContent.questions;
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      console.error('Raw content:', data.choices[0].message.content);
      throw new Error(`Failed to parse generated questions: ${error.message}`);
    }
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
};