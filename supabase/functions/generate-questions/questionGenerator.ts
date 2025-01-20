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
            content: `You are an expert in creating educational quiz questions. Generate exactly 5 questions based on the provided content, following these guidelines:

1. Question Distribution:
   - 2 easy questions
   - 2 medium questions
   - 1 advanced question

2. Question Types:
   - Mix of multiple-choice and true-false questions
   - For multiple-choice, provide exactly 4 options
   - Make sure exactly one answer is correct

3. Quality Guidelines:
   - Questions should be clear and concise
   - Answers should be unambiguous
   - Include helpful feedback for each question`
          },
          { 
            role: 'user', 
            content: `Generate questions based on this content: ${options.content.substring(0, 4000)}` 
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