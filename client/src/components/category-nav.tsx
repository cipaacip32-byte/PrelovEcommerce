import { Link, useLocation } from "wouter";
import { 
  Smartphone, 
  Shirt, 
  Sofa, 
  Gamepad2, 
  BookOpen, 
  Car, 
  Baby, 
  Dumbbell,
  LayoutGrid,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const categories = [
  { id: "all", name: "Semua", slug: "", icon: LayoutGrid },
  { id: "electronics", name: "Elektronik", slug: "elektronik", icon: Smartphone },
  { id: "fashion", name: "Fashion", slug: "fashion", icon: Shirt },
  { id: "furniture", name: "Furniture", slug: "furniture", icon: Sofa },
  { id: "hobby", name: "Hobi & Koleksi", slug: "hobi-koleksi", icon: Gamepad2 },
  { id: "books", name: "Buku", slug: "buku", icon: BookOpen },
  { id: "automotive", name: "Otomotif", slug: "otomotif", icon: Car },
  { id: "baby", name: "Perlengkapan Bayi", slug: "perlengkapan-bayi", icon: Baby },
  { id: "sports", name: "Olahraga", slug: "olahraga", icon: Dumbbell },
  { id: "beauty", name: "Kecantikan", slug: "kecantikan", icon: Sparkles },
];

interface CategoryNavProps {
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export function CategoryNav({ activeCategory = "", onCategoryChange }: CategoryNavProps) {
  const [location, setLocation] = useLocation();

  const handleCategoryClick = (slug: string) => {
    if (onCategoryChange) {
      onCategoryChange(slug);
    } else {
      setLocation(slug ? `/?category=${slug}` : "/");
    }
  };

  return (
    <div className="w-full border-b bg-background/80 backdrop-blur-sm sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollArea className="w-full whitespace-nowrap py-3">
          <div className="flex gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.slug;
              
              return (
                <Button
                  key={category.id}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className="flex items-center gap-2 shrink-0"
                  onClick={() => handleCategoryClick(category.slug)}
                  data-testid={`button-category-${category.id}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </Button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}

export { categories };
