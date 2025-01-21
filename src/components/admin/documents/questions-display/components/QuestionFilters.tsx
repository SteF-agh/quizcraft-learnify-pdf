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
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex-1 min-w-[200px]">
        <Select value={selectedCourse} onValueChange={onCourseChange}>
          <SelectTrigger>
            <SelectValue placeholder="Kurs auswählen" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course} value={course}>
                {course === 'all' ? 'Alle Kurse' : course}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-[200px]">
        <Select value={selectedChapter} onValueChange={onChapterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Kapitel auswählen" />
          </SelectTrigger>
          <SelectContent>
            {chapters.map((chapter) => (
              <SelectItem key={chapter} value={chapter}>
                {chapter === 'all' ? 'Alle Kapitel' : chapter}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-[200px]">
        <Select value={selectedTopic} onValueChange={onTopicChange}>
          <SelectTrigger>
            <SelectValue placeholder="Thema auswählen" />
          </SelectTrigger>
          <SelectContent>
            {topics.map((topic) => (
              <SelectItem key={topic} value={topic}>
                {topic === 'all' ? 'Alle Themen' : topic}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};