import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { AvatarPreview } from "@/components/avatar-creator/AvatarPreview";
import { OptionsList } from "@/components/avatar-creator/OptionsList";
import { CategoryTabs } from "@/components/avatar-creator/CategoryTabs";

const avatarTypes = [
  { id: "human", name: "Mensch" },
  { id: "robot", name: "Roboter" },
  { id: "hybrid", name: "Hybrid (Mensch/Roboter)" },
];

const avatarOptions = {
  skin: [
    { id: "light", name: "Hell" },
    { id: "medium", name: "Mittel" },
    { id: "dark", name: "Dunkel" },
  ],
  hair: [
    { id: "short", name: "Kurz" },
    { id: "long", name: "Lang" },
    { id: "curly", name: "Lockig" },
  ],
  accessories: [
    { id: "glasses", name: "Brille" },
    { id: "hat", name: "Hut" },
    { id: "earrings", name: "Ohrringe" },
  ],
  facial: [
    { id: "none", name: "Keine" },
    { id: "mustache", name: "Schnurrbart" },
    { id: "goatee", name: "Spitzbart" },
  ],
};

const AvatarCreator = () => {
  const [selectedAvatarType, setSelectedAvatarType] = useState("human");
  const [selectedCategory, setSelectedCategory] = useState("skin");
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({
    skin: "light",
    hair: "short",
    accessories: "none",
    facial: "none",
  });

  const handleOptionSelect = (optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [selectedCategory]: optionId,
    }));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Avatar Creator</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Avatar-Typ</h2>
            <div className="mb-6">
              <OptionsList
                options={avatarTypes}
                selectedOption={selectedAvatarType}
                onSelect={setSelectedAvatarType}
              />
            </div>

            <h2 className="text-xl font-semibold mb-4">Anpassungen</h2>
            <CategoryTabs
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            
            <div className="mt-6">
              <OptionsList
                options={avatarOptions[selectedCategory as keyof typeof avatarOptions]}
                selectedOption={selectedOptions[selectedCategory]}
                onSelect={handleOptionSelect}
              />
            </div>
          </Card>

          <AvatarPreview selectedOptions={{ type: selectedAvatarType, ...selectedOptions }} />
        </div>
      </div>
    </Layout>
  );
};

export default AvatarCreator;