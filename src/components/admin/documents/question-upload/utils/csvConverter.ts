import { Question } from "../../types";

const mapDifficulty = (difficulty: string): "easy" | "medium" | "advanced" => {
  const difficultyMap: Record<string, "easy" | "medium" | "advanced"> = {
    "Leicht": "easy",
    "Mittel": "medium",
    "Schwer": "advanced"
  };
  return difficultyMap[difficulty] || "medium";
};

const mapQuestionType = (type: string): "multiple-choice" | "single-choice" | "true-false" => {
  const typeMap: Record<string, "multiple-choice" | "single-choice" | "true-false"> = {
    "Multiple Choice": "multiple-choice",
    "True/False": "true-false",
    "Single Choice": "single-choice"
  };
  return typeMap[type] || "multiple-choice";
};

export const convertCsvToQuestions = (file: File): Promise<Question[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n').map(row => {
          // Split by tab since it's a TSV format
          return row.split('\t').map(cell => cell.trim());
        });
        
        const headers = rows[0];
        const questions: Question[] = rows.slice(1)
          .filter(row => row.length > 1) // Skip empty rows
          .map(row => {
            const rowData: Record<string, string> = {};
            headers.forEach((header, index) => {
              rowData[header] = row[index] || '';
            });

            // Convert the row data to match our Question interface
            const answers = [];
            for (let i = 1; i <= 4; i++) {
              const answerText = rowData[`Antwort ${i}`];
              const isCorrect = rowData[`Antwort ${i} korrekt`]?.toLowerCase();
              
              if (answerText) {
                answers.push({
                  text: answerText,
                  isCorrect: isCorrect === 'true' || isCorrect === 'correct'
                });
              }
            }

            return {
              course_name: rowData['Kursname'] || 'KI Manager',
              chapter: rowData['Kapitel'] || 'Grundlagen',
              topic: rowData['Thema'] || 'KI Basics',
              difficulty: mapDifficulty(rowData['Schwierigkeitsgrad']),
              question_text: rowData['Fragentext'] || '',
              type: mapQuestionType(rowData['Typ']),
              points: parseInt(rowData['Punktewert']) || 1,
              answers,
              feedback: rowData['Feedback'],
              learning_objective_id: rowData['Lernziel-ID'],
              metadata: rowData['Metadaten'] ? JSON.parse(rowData['Metadaten']) : undefined
            };
          });

        console.log('Converted questions:', questions);
        resolve(questions);
      } catch (error) {
        console.error('Error converting CSV:', error);
        reject(new Error('Fehler beim Konvertieren der CSV-Datei'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Fehler beim Lesen der CSV-Datei'));
    };

    reader.readAsText(file);
  });
};