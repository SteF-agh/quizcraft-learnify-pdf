import { CsvQuestion, Question } from "../../types";
import Papa from 'papaparse';

const mapDifficulty = (difficulty: string): "easy" | "medium" | "advanced" => {
  const difficultyMap: { [key: string]: "easy" | "medium" | "advanced" } = {
    'leicht': 'easy',
    'mittel': 'medium',
    'schwer': 'advanced',
    'Leicht': 'easy',
    'Mittel': 'medium',
    'Schwer': 'advanced'
  };
  return difficultyMap[difficulty] || 'medium';
};

const mapQuestionType = (type: string): "multiple-choice" | "single-choice" | "true-false" => {
  const typeMap: { [key: string]: "multiple-choice" | "single-choice" | "true-false" } = {
    'Multiple Choice': 'multiple-choice',
    'Single Choice': 'single-choice',
    'Wahr/Falsch': 'true-false',
    'multiple-choice': 'multiple-choice',
    'single-choice': 'single-choice',
    'true-false': 'true-false'
  };
  return typeMap[type] || 'multiple-choice';
};

export const convertCsvToQuestions = async (file: File): Promise<Question[]> => {
  console.log('Starting CSV conversion for file:', file.name);
  
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        console.log('CSV parsing complete. Raw results:', results);
        
        try {
          const questions: Question[] = (results.data as CsvQuestion[])
            .filter(row => row.Fragentext && row['Antwort 1']) // Filter out empty rows
            .map(row => {
              console.log('Processing row:', row);
              
              // Create answers array from the CSV data
              const answers = [];
              for (let i = 1; i <= 4; i++) {
                const answerText = row[`Antwort ${i}` as keyof CsvQuestion];
                const isCorrect = row[`Antwort ${i} korrekt` as keyof CsvQuestion];
                
                if (answerText) {
                  answers.push({
                    text: answerText,
                    isCorrect: isCorrect?.toLowerCase() === 'true' || isCorrect === '1'
                  });
                }
              }

              // Handle metadata
              let metadata = null;
              try {
                metadata = row.Metadaten ? JSON.parse(row.Metadaten) : null;
              } catch (e) {
                console.warn('Failed to parse metadata:', e);
                metadata = { raw: row.Metadaten };
              }

              // Convert learning objective ID to null if it's not a valid UUID
              const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
              const learningObjectiveId = uuidRegex.test(row['Lernziel-ID']) ? row['Lernziel-ID'] : null;

              if (!uuidRegex.test(row['Lernziel-ID'])) {
                console.log('Invalid UUID format for learning objective ID:', row['Lernziel-ID'], 'Setting to null');
              }

              const question: Question = {
                course_name: row.Kursname || 'Unspecified Course',
                chapter: row.Kapitel || 'Chapter 1',
                topic: row.Thema || 'General',
                difficulty: mapDifficulty(row.Schwierigkeitsgrad),
                question_text: row.Fragentext,
                type: mapQuestionType(row.Typ),
                points: parseInt(row.Punktewert) || 10,
                answers: answers,
                feedback: row.Feedback || undefined,
                learning_objective_id: learningObjectiveId,
                metadata: metadata || undefined
              };

              console.log('Processed question:', question);
              return question;
            });

          console.log('Converted questions:', questions);
          resolve(questions);
        } catch (error) {
          console.error('Error converting CSV data:', error);
          reject(error);
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        reject(error);
      }
    });
  });
};