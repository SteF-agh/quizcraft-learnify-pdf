import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Crown, Glasses, Scissors } from "lucide-react";

interface CategoryTabsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryTabs = ({ selectedCategory, onSelectCategory }: CategoryTabsProps) => {
  return (
    <Tabs value={selectedCategory} onValueChange={onSelectCategory}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="skin">
          <Palette className="w-4 h-4" />
        </TabsTrigger>
        <TabsTrigger value="hair">
          <Crown className="w-4 h-4" />
        </TabsTrigger>
        <TabsTrigger value="accessories">
          <Glasses className="w-4 h-4" />
        </TabsTrigger>
        <TabsTrigger value="facial">
          <Scissors className="w-4 h-4" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};