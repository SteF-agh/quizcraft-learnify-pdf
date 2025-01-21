import { Question } from "../../types";

export const convertCsvToQuestions = (file: File): Promise<Question[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n').map(row => row.split(','));
        const headers = rows[0].map(header => header.trim());
        
        const questions: Question[] = rows.slice(1).map(row => {
          const question: any = {};
          headers.forEach((header, index) => {
            if (header === 'answers') {
              try {
                question[header] = JSON.parse(row[index]);
              } catch {
                question[header] = [];
              }
            } else {
              question[header] = row[index]?.trim() || '';
            }
          });

          return {
            course_name: question.course_name || '',
            chapter: question.chapter || '',
            topic: question.topic || '',
            difficulty: question.difficulty || 'medium',
            question_text: question.question_text || '',
            type: question.type || 'multiple-choice',
            points: parseInt(question.points) || 10,
            answers: Array.isArray(question.answers) ? question.answers : [],
            feedback: question.feedback,
          };
        }).filter(q => q.question_text && q.answers.length > 0);

        resolve(questions);
      } catch (error) {
        reject(new Error('Fehler beim Konvertieren der CSV-Datei'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Fehler beim Lesen der CSV-Datei'));
    };

    reader.readAsText(file);
  });
};