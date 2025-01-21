import * as XLSX from 'xlsx';
import { Question } from "../../types";

export const convertExcelToQuestions = (file: File): Promise<Question[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const questions: Question[] = jsonData.map((row: any) => ({
          course_name: row.course_name || '',
          chapter: row.chapter || '',
          topic: row.topic || '',
          difficulty: row.difficulty || 'medium',
          question_text: row.question_text || '',
          type: row.type || 'multiple-choice',
          points: parseInt(row.points) || 10,
          answers: parseAnswers(row),
          feedback: row.feedback,
        }));

        resolve(questions);
      } catch (error) {
        reject(new Error('Fehler beim Konvertieren der Excel-Datei'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Fehler beim Lesen der Excel-Datei'));
    };

    reader.readAsArrayBuffer(file);
  });
};

const parseAnswers = (row: any) => {
  const answers = [];
  let i = 1;
  
  while (row[`answer_${i}`] && row[`is_correct_${i}`] !== undefined) {
    answers.push({
      text: row[`answer_${i}`],
      isCorrect: row[`is_correct_${i}`].toString().toLowerCase() === 'true'
    });
    i++;
  }

  return answers;
};