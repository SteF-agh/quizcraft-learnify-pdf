interface EmptyStateProps {
  documentId: string | null;
  questionsCount: number;
}

export const EmptyState = ({ documentId, questionsCount }: EmptyStateProps) => {
  if (!documentId) {
    return (
      <p className="text-slate-600">
        Bitte wählen Sie ein Dokument aus, um dessen Fragen anzuzeigen.
      </p>
    );
  }

  if (questionsCount === 0) {
    return (
      <p className="text-slate-600">
        Keine Fragen für dieses Dokument vorhanden.
      </p>
    );
  }

  return null;
};