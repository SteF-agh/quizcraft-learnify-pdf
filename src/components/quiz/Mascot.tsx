interface MascotProps {
  showMotivation: boolean;
}

export const Mascot = ({ showMotivation }: MascotProps) => {
  return (
    <div className="fixed bottom-8 right-8">
      <img
        src="/lovable-uploads/0c9c15e3-978d-4d58-95c3-d935f65127d1.png"
        alt="Leeon Mascot"
        className={`w-48 h-48 object-contain transition-transform duration-300 ${
          showMotivation ? "animate-bounce" : ""
        }`}
      />
      {showMotivation && (
        <div className="absolute top-0 right-full mr-4 bg-white p-4 rounded-lg shadow-lg animate-fade-in">
          <p className="text-secondary font-bold">Super gemacht! 🎉</p>
        </div>
      )}
    </div>
  );
};