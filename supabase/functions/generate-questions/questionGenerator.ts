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
            content: `You are an expert in creating educational quiz questions. Generate exactly 5 questions based on the provided content. Return them as an array of objects with the following EXACT structure:

{
  "questions": [
    {
      "documentId": "string (from input)",
      "courseName": "string (extract from content)",
      "chapter": "string (extract from content)",
      "topic": "string (extract from content)",
      "difficulty": "easy" | "medium" | "advanced",
      "questionText": "string",
      "type": "multiple-choice" | "single-choice" | "true-false",
      "points": number,
      "answers": [
        {
          "text": "string",
          "isCorrect": boolean
        }
      ],
      "feedback": "string"
    }
  ]
}

Guidelines:
1. Question Distribution:
   - 2 easy questions
   - 2 medium questions
   - 1 advanced question
2. Question Types:
   - Mix of multiple-choice and true-false questions
   - For multiple-choice, provide exactly 4 options
   - Make sure exactly one answer is correct for single-choice
   - For true-false, provide exactly 2 options
3. Quality Guidelines:
   - Questions should be clear and concise
   - Answers should be unambiguous
   - Include helpful feedback for each question
4. Points:
   - easy: 5 points
   - medium: 10 points
   - advanced: 15 points`
          },
          { 
            role: 'user', 
            content: `Generate questions based on this content: ${options.content.substring(0, 4000)}

Document ID to use: ${options.documentId}
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
        
        if (!question.documentId || 
            !question.courseName ||
            !question.chapter ||
            !question.topic ||
            !question.difficulty ||
            !question.questionText ||
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

        // Validate type
        if (!['multiple-choice', 'single-choice', 'true-false'].includes(question.type)) {
          throw new Error(`Question ${index + 1} has invalid type: ${question.type}`);
        }

        // Validate answers
        if (question.type === 'multiple-choice' && question.answers.length !== 4) {
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