import { Layout } from "@/components/layout/Layout";
import { FlashcardsDeck } from "@/components/flashcards/FlashcardsDeck";
import { useSearchParams } from "react-router-dom";

const Flashcards = () => {
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get("documentId");

  if (!documentId) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Kein Dokument ausgewählt</h1>
          <p className="text-muted-foreground">
            Bitte wähle zuerst ein Dokument aus dem Dashboard aus.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4">
        <FlashcardsDeck documentId={documentId} />
      </div>
    </Layout>
  );
};

export default Flashcards;