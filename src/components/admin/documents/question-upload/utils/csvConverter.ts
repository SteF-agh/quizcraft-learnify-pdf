import { Question } from "../../types";

const mapDifficulty = (difficulty: string): "easy" | "medium" | "advanced" => {
  console.log('Mapping difficulty:', difficulty);
  const difficultyMap: Record<string, "easy" | "medium" | "advanced"> = {
    "Leicht": "easy",
    "Mittel": "medium",
    "Schwer": "advanced",
    "Easy": "easy",
    "Medium": "medium",
    "Advanced": "advanced"
  };
  return difficultyMap[difficulty] || "medium";
};

const mapQuestionType = (type: string): "multiple-choice" | "single-choice" | "true-false" => {
  console.log('Mapping question type:', type);
  const typeMap: Record<string, "multiple-choice" | "single-choice" | "true-false"> = {
    "Multiple Choice": "multiple-choice",
    "Multiple-Choice": "multiple-choice",
    "Single Choice": "single-choice",
    "Single-Choice": "single-choice",
    "True/False": "true-false",
    "True-False": "true-false"
  };
  return typeMap[type] || "multiple-choice";
};

export const convertCsvToQuestions = (file: File): Promise<Question[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        console.log('Starting CSV conversion...');
        const text = e.target?.result as string;
        
        // Split by newline and handle both \n and \r\n
        const rows = text.split(/\r?\n/).map(row => {
          // Split by tab or semicolon to handle different CSV formats
          const cells = row.includes(';') ? row.split(';') : row.split('\t');
          return cells.map(cell => cell.trim());
        });
        
        console.log('CSV Headers:', rows[0]);
        const headers = rows[0];

        const questions: Question[] = rows.slice(1)
          .filter(row => row.length > 1) // Skip empty rows
          .map((row, index) => {
            console.log(`Processing row ${index + 1}:`, row);
            
            const rowData: Record<string, string> = {};
            headers.forEach((header, index) => {
              rowData[header] = row[index] || '';
            });

            console.log('Row data:', rowData);

            // Convert the row data to match our Question interface
            const answers = [];
            for (let i = 1; i <= 4; i++) {
              const answerText = rowData[`Antwort ${i}`];
              const isCorrect = rowData[`Antwort ${i} korrekt`]?.toLowerCase();
              
              if (answerText) {
                answers.push({
                  text: answerText,
                  isCorrect: isCorrect === 'true' || isCorrect === 'correct' || isCorrect === 'ja' || isCorrect === '1'
                });
              }
            }

            console.log('Processed answers:', answers);

            const question: Question = {
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

            console.log('Created question object:', question);
            return question;
          });

        console.log('Total questions converted:', questions.length);
        resolve(questions);
      } catch (error) {
        console.error('Error converting CSV:', error);
        reject(new Error(`Fehler beim Konvertieren der CSV-Datei: ${error.message}`));
      }
    };

    reader.onerror = () => {
      console.error('Error reading CSV file');
      reject(new Error('Fehler beim Lesen der CSV-Datei'));
    };

    reader.readAsText(file);
  });
};