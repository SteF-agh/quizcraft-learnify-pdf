import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuestionFiltersProps {
  courses: string[];
  chapters: string[];
  topics: string[];
  selectedCourse: string;
  selectedChapter: string;
  selectedTopic: string;
  onCourseChange: (value: string) => void;
  onChapterChange: (value: string) => void;
  onTopicChange: (value: string) => void;
}

export const QuestionFilters = ({
  courses,
  chapters,
  topics,
  selectedCourse,
  selectedChapter,
  selectedTopic,
  onCourseChange,
  onChapterChange,
  onTopicChange,
}: QuestionFiltersProps) => {
  return (
    <div className="flex gap-4 mb-4">
      <Select value={selectedCourse} onValueChange={onCourseChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Kurs auswählen" />
        </SelectTrigger>
        <SelectContent>
          {courses.map((course) => (
            <SelectItem key={course} value={course || "unknown"}>
              {course === "all" ? "Alle Kurse" : (course || "Unbekannter Kurs")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedChapter} onValueChange={onChapterChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Kapitel auswählen" />
        </SelectTrigger>
        <SelectContent>
          {chapters.map((chapter) => (
            <SelectItem key={chapter} value={chapter || "unknown"}>
              {chapter === "all" ? "Alle Kapitel" : (chapter || "Unbekanntes Kapitel")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedTopic} onValueChange={onTopicChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Thema auswählen" />
        </SelectTrigger>
        <SelectContent>
          {topics.map((topic) => (
            <SelectItem key={topic} value={topic || "unknown"}>
              {topic === "all" ? "Alle Themen" : (topic || "Unbekanntes Thema")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};