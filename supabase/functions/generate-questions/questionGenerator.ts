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
        model: 'gpt-4',
        messages: [
          { 
            role: 'system', 
            content: `You are an expert in creating educational quiz questions. Generate exactly 30 questions per chapter based on the provided content. Return them as an array of objects with the following EXACT structure:

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
      "feedback": "string",
      "learningObjectiveId": "string (optional)",
      "metadata": object (optional)
    }
  ]
}

Guidelines:
1. Question Distribution per Chapter:
   - 10 easy questions (5 points each)
   - 10 medium questions (10 points each)
   - 10 advanced questions (15 points each)

2. Question Types Distribution:
   - 40% multiple-choice questions (4 options, one correct)
   - 40% single-choice questions (4 options, one correct)
   - 20% true-false questions (2 options)
   - Position the correct answer randomly across options

3. Quality Guidelines:
   - Questions should be clear and concise
   - Answers should be unambiguous
   - Include helpful feedback for each question
   - Avoid duplicate questions
   - Distribute questions proportionally across all chapters

4. Answer Format:
   - Multiple/Single Choice: Exactly 4 options
   - True/False: Exactly 2 options
   - Randomize correct answer position
   - Ensure answers are distinct and clear`
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

        // Validate type and number of answers
        if (['multiple-choice', 'single-choice'].includes(question.type) && question.answers.length !== 4) {
          throw new Error(`Question ${index + 1} should have exactly 4 options`);
        }
        if (question.type === 'true-false' && question.answers.length !== 2) {
          throw new Error(`Question ${index + 1} should have exactly 2 options`);
        }

        // Validate type distribution
        const questionTypes = parsedContent.questions.map((q: any) => q.type);
        const multipleChoiceCount = questionTypes.filter((t: string) => t === 'multiple-choice').length;
        const singleChoiceCount = questionTypes.filter((t: string) => t === 'single-choice').length;
        const trueFalseCount = questionTypes.filter((t: string) => t === 'true-false').length;

        const totalQuestions = parsedContent.questions.length;
        if (multipleChoiceCount / totalQuestions < 0.35 || multipleChoiceCount / totalQuestions > 0.45) {
          console.warn('Multiple choice questions distribution is not optimal');
        }
        if (singleChoiceCount / totalQuestions < 0.35 || singleChoiceCount / totalQuestions > 0.45) {
          console.warn('Single choice questions distribution is not optimal');
        }
        if (trueFalseCount / totalQuestions < 0.15 || trueFalseCount / totalQuestions > 0.25) {
          console.warn('True/False questions distribution is not optimal');
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