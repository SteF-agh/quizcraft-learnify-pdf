import { useState } from "react";
import { Question } from "../types";
import { QuestionFilters } from "./components/QuestionFilters";
import { QuestionsTable } from "./components/QuestionsTable";
import { EmptyState } from "./components/EmptyState";

interface QuestionsDisplayProps {
  questions: Question[];
  documentId: string | null;
}

export const QuestionsDisplay = ({ questions, documentId }: QuestionsDisplayProps) => {
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedChapter, setSelectedChapter] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");

  console.log('QuestionsDisplay rendered with:', { questions, documentId });

  // Get unique values for filters and ensure no empty values
  const courses = ["all", ...new Set(questions.map(q => q.course_name || 'Unbekannter Kurs'))];
  const chapters = ["all", ...new Set(questions.map(q => q.chapter || 'Unbekanntes Kapitel'))];
  const topics = ["all", ...new Set(questions.map(q => q.topic || 'Unbekanntes Thema'))];

  // Filter questions based on selections
  const filteredQuestions = questions.filter(question => {
    const matchesCourse = selectedCourse === "all" || question.course_name === selectedCourse;
    const matchesChapter = selectedChapter === "all" || question.chapter === selectedChapter;
    const matchesTopic = selectedTopic === "all" || question.topic === selectedTopic;
    return matchesCourse && matchesChapter && matchesTopic;
  });

  return (
    <div className="bg-slate-50 p-6 rounded-lg border mt-8">
      <h2 className="text-2xl font-semibold mb-2">Generierte bzw. hochgeladene Fragen</h2>
      
      <EmptyState documentId={documentId} questionsCount={questions.length} />
      
      {questions.length > 0 && (
        <>
          <QuestionFilters
            courses={courses}
            chapters={chapters}
            topics={topics}
            selectedCourse={selectedCourse}
            selectedChapter={selectedChapter}
            selectedTopic={selectedTopic}
            onCourseChange={setSelectedCourse}
            onChapterChange={setSelectedChapter}
            onTopicChange={setSelectedTopic}
          />
          
          <p className="text-slate-600 mb-4">
            {filteredQuestions.length} {filteredQuestions.length === 1 ? 'Frage wurde' : 'Fragen wurden'} für dieses Dokument erfasst:
          </p>
          
          <QuestionsTable questions={filteredQuestions} />
        </>
      )}
    </div>
  );
};