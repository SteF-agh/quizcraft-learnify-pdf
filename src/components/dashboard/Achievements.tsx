import { Card } from "@/components/ui/card"

export const Achievements = () => {
  return (
    <Card className="p-8 space-y-6 shadow-lg hover:shadow-xl transition-shadow">
      <h2 className="text-2xl font-bold text-secondary">Errungenschaften</h2>
      <div className="grid grid-cols-3 gap-6">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-primary-20 flex items-center justify-center mb-2 shadow-md">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-sm font-medium text-center">Erste Schritte</span>
        </div>
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-secondary-20 flex items-center justify-center mb-2 shadow-md">
            <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-center">Schnell wie der Blitz</span>
        </div>
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-accent-20 flex items-center justify-center mb-2 shadow-md">
            <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="text-sm font-medium text-center">Bücherwurm</span>
        </div>
      </div>
    </Card>
  );
};