import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { AvatarPreview } from "@/components/avatar-creator/AvatarPreview";
import { OptionsList } from "@/components/avatar-creator/OptionsList";
import { CategoryTabs } from "@/components/avatar-creator/CategoryTabs";

const avatarOptions = {
  skin: [
    { id: "light", name: "Light" },
    { id: "medium", name: "Medium" },
    { id: "dark", name: "Dark" },
  ],
  hair: [
    { id: "short", name: "Short" },
    { id: "long", name: "Long" },
    { id: "curly", name: "Curly" },
  ],
  accessories: [
    { id: "glasses", name: "Glasses" },
    { id: "hat", name: "Hat" },
    { id: "earrings", name: "Earrings" },
  ],
  facial: [
    { id: "none", name: "None" },
    { id: "mustache", name: "Mustache" },
    { id: "goatee", name: "Goatee" },
  ],
};

const AvatarCreator = () => {
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

          <AvatarPreview selectedOptions={selectedOptions} />
        </div>
      </div>
    </Layout>
  );
};

export default AvatarCreator;