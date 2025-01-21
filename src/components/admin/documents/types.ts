export interface Question {
  id?: string;
  document_id?: string;
  course_name: string;
  chapter: string;
  topic: string;
  difficulty: "easy" | "medium" | "advanced";
  question_text: string;
  type: "multiple-choice" | "single-choice" | "true-false";
  points: number;
  answers: {
    text: string;
    isCorrect: boolean;
  }[];
  feedback?: string;
  learning_objective_id?: string;
  metadata?: Record<string, any>;
}

export interface Document {
  id: string;
  name: string;
  file_size?: number;
  created_at: string;
  is_public?: boolean;
}

export interface CsvQuestion {
  ID: string;
  Kursname: string;
  Kapitel: string;
  Thema: string;
  Schwierigkeitsgrad: string;
  Fragentext: string;
  Typ: string;
  Punktewert: string;
  'Antwort 1': string;
  'Antwort 1 korrekt': string;
  'Antwort 2': string;
  'Antwort 2 korrekt': string;
  'Antwort 3': string;
  'Antwort 3 korrekt': string;
  'Antwort 4': string;
  'Antwort 4 korrekt': string;
  Feedback: string;
  'Lernziel-ID': string;
  Metadaten: string;
}