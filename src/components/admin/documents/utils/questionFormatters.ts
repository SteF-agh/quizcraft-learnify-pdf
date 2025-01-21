export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getTypeLabel = (type: string) => {
  switch (type) {
    case 'multiple-choice':
      return 'Multiple Choice';
    case 'single-choice':
      return 'Single Choice';
    case 'true-false':
      return 'Wahr/Falsch';
    default:
      return type;
  }
};