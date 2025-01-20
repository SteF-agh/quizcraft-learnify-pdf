import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Book, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ChapterSelectionProps {
  documentId: string;
  onStart: (selectedChapter: string | null) => void;
}

export const ChapterSelection = ({ documentId, onStart }: ChapterSelectionProps) => {
  const [chapters, setChapters] = useState<string[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [documentName, setDocumentName] = useState("");

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        console.log('Fetching chapters for document:', documentId);
        
        // Fetch document name
        const { data: documentData } = await supabase
          .from('documents')
          .select('name')
          .eq('id', documentId)
          .single();
        
        if (documentData) {
          setDocumentName(documentData.name);
        }

        // Fetch unique chapters
        const { data: questionsData, error } = await supabase
          .from('quiz_questions')
          .select('chapter')
          .eq('document_id', documentId)
          .order('chapter');

        if (error) throw error;

        const uniqueChapters = Array.from(
          new Set(questionsData?.map(q => q.chapter))
        ).filter(Boolean);

        console.log('Fetched chapters:', uniqueChapters);
        setChapters(uniqueChapters);
      } catch (error) {
        console.error('Error fetching chapters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [documentId]);

  const handleStart = () => {
    onStart(selectedChapter);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-primary">Lade Kapitel...</div>
      </div>
    );
  }

  return (
    <Card className="p-8 space-y-6 bg-white/80 backdrop-blur-sm">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-secondary">
          {documentName}
        </h2>
        <p className="text-muted-foreground">
          Wähle aus, ob du das gesamte Skript oder einzelne Kapitel lernen möchtest.
        </p>
      </div>

      <RadioGroup
        value={selectedChapter || "all"}
        onValueChange={(value) => setSelectedChapter(value === "all" ? null : value)}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent/5 transition-colors">
          <RadioGroupItem value="all" id="all" />
          <Label htmlFor="all" className="flex items-center gap-2 cursor-pointer">
            <BookOpen className="h-5 w-5 text-primary" />
            Gesamtes Skript
          </Label>
        </div>

        {chapters.map((chapter) => (
          <div
            key={chapter}
            className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent/5 transition-colors"
          >
            <RadioGroupItem value={chapter} id={chapter} />
            <Label htmlFor={chapter} className="flex items-center gap-2 cursor-pointer">
              <Book className="h-5 w-5 text-primary" />
              {chapter}
            </Label>
          </div>
        ))}
      </RadioGroup>

      <Button
        onClick={handleStart}
        className="w-full bg-gradient-to-r from-primary to-secondary text-white"
        size="lg"
      >
        Quiz starten
      </Button>
    </Card>
  );
};