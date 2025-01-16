import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  User,
  Shirt,
  Palette,
  Crown,
  Glasses,
  Scissors,
} from "lucide-react";

interface AvatarOption {
  id: string;
  name: string;
  preview: string;
}

const AvatarCreator = () => {
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState({
    skinColor: "#F5D0C5",
    hairStyle: "default",
    clothing: "casual",
    accessories: "none",
    facialHair: "none",
  });

  // Sample data - in a real app, this would come from your backend
  const skinColors = [
    "#F5D0C5", "#EDB98A", "#D08B5B", "#AE5D29", "#694D3D"
  ];

  const clothingOptions: AvatarOption[] = [
    { id: "casual", name: "Casual", preview: "👕" },
    { id: "formal", name: "Formal", preview: "🎽" },
    { id: "sporty", name: "Sporty", preview: "🏃" },
  ];

  const accessoryOptions: AvatarOption[] = [
    { id: "none", name: "Keine", preview: "❌" },
    { id: "glasses", name: "Brille", preview: "👓" },
    { id: "hat", name: "Hut", preview: "🎩" },
  ];

  const handleSave = async () => {
    try {
      // Here you would typically save the avatar configuration to your backend
      toast.success("Avatar erfolgreich gespeichert!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Fehler beim Speichern des Avatars");
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Avatar erstellen</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Preview Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Vorschau</h2>
            <div 
              className="aspect-square rounded-full bg-accent flex items-center justify-center"
              style={{ backgroundColor: selectedOptions.skinColor }}
            >
              {/* This is a placeholder for the actual avatar preview */}
              <User className="w-24 h-24 text-primary" />
            </div>
          </Card>

          {/* Customization Section */}
          <div className="space-y-6">
            <Tabs defaultValue="skin" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="skin">
                  <Palette className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="hair">
                  <Crown className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="clothing">
                  <Shirt className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="accessories">
                  <Glasses className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="facial">
                  <Scissors className="w-4 h-4" />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="skin" className="mt-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Hautfarbe</h3>
                  <div className="flex gap-2">
                    {skinColors.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 ${
                          selectedOptions.skinColor === color
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() =>
                          setSelectedOptions({ ...selectedOptions, skinColor: color })
                        }
                      />
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="clothing" className="mt-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Kleidung</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {clothingOptions.map((option) => (
                      <button
                        key={option.id}
                        className={`p-4 text-center rounded-lg ${
                          selectedOptions.clothing === option.id
                            ? "bg-primary/10 border-2 border-primary"
                            : "bg-accent"
                        }`}
                        onClick={() =>
                          setSelectedOptions({ ...selectedOptions, clothing: option.id })
                        }
                      >
                        <div className="text-2xl mb-1">{option.preview}</div>
                        <div className="text-sm">{option.name}</div>
                      </button>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Similar content for other tabs */}
            </Tabs>

            <Button onClick={handleSave} className="w-full">
              Avatar speichern
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AvatarCreator;