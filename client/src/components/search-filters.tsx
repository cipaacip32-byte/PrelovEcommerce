import { useState } from "react";
import { Filter, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/components/category-nav";

interface SearchFiltersProps {
  filters: {
    category?: string;
    condition?: string[];
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
  };
  onFilterChange: (filters: any) => void;
}

const conditions = [
  { id: "seperti-baru", label: "Seperti Baru" },
  { id: "bagus", label: "Bagus" },
  { id: "layak-pakai", label: "Layak Pakai" },
];

const sortOptions = [
  { value: "newest", label: "Terbaru" },
  { value: "price-low", label: "Harga Terendah" },
  { value: "price-high", label: "Harga Tertinggi" },
  { value: "most-viewed", label: "Terpopuler" },
];

export function SearchFilters({ filters, onFilterChange }: SearchFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice || 0,
    filters.maxPrice || 10000000,
  ]);
  const [isConditionOpen, setIsConditionOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  const handleConditionChange = (conditionId: string, checked: boolean) => {
    const currentConditions = filters.condition || [];
    const newConditions = checked
      ? [...currentConditions, conditionId]
      : currentConditions.filter((c) => c !== conditionId);
    onFilterChange({ ...filters, condition: newConditions });
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const handlePriceApply = () => {
    onFilterChange({
      ...filters,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  };

  const handleSortChange = (value: string) => {
    onFilterChange({ ...filters, sortBy: value });
  };

  const handleClearFilters = () => {
    setPriceRange([0, 10000000]);
    onFilterChange({});
  };

  const activeFilterCount = 
    (filters.condition?.length || 0) +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice && filters.maxPrice < 10000000 ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort */}
      <div className="space-y-2">
        <Label>Urutkan</Label>
        <Select value={filters.sortBy || "newest"} onValueChange={handleSortChange}>
          <SelectTrigger data-testid="select-sort">
            <SelectValue placeholder="Urutkan berdasarkan" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Condition Filter */}
      <Collapsible open={isConditionOpen} onOpenChange={setIsConditionOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <Label className="cursor-pointer">Kondisi</Label>
          <ChevronDown className={`h-4 w-4 transition-transform ${isConditionOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-2">
          {conditions.map((condition) => (
            <div key={condition.id} className="flex items-center space-x-2">
              <Checkbox
                id={condition.id}
                checked={filters.condition?.includes(condition.id)}
                onCheckedChange={(checked) =>
                  handleConditionChange(condition.id, checked as boolean)
                }
                data-testid={`checkbox-condition-${condition.id}`}
              />
              <Label htmlFor={condition.id} className="text-sm font-normal cursor-pointer">
                {condition.label}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Price Filter */}
      <Collapsible open={isPriceOpen} onOpenChange={setIsPriceOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <Label className="cursor-pointer">Harga</Label>
          <ChevronDown className={`h-4 w-4 transition-transform ${isPriceOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-2">
          <div className="space-y-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={10000000}
              step={100000}
              className="w-full"
              data-testid="slider-price-range"
            />
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="text-sm"
                placeholder="Min"
                data-testid="input-price-min"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="text-sm"
                placeholder="Max"
                data-testid="input-price-max"
              />
            </div>
            <Button 
              size="sm" 
              className="w-full" 
              onClick={handlePriceApply}
              data-testid="button-apply-price"
            >
              Terapkan
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleClearFilters}
          data-testid="button-clear-filters"
        >
          <X className="h-4 w-4 mr-2" />
          Hapus Semua Filter
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-36 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Filter</h2>
            {activeFilterCount > 0 && (
              <span className="text-sm text-muted-foreground">
                {activeFilterCount} aktif
              </span>
            )}
          </div>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2" data-testid="button-mobile-filter">
              <Filter className="h-4 w-4" />
              Filter
              {activeFilterCount > 0 && (
                <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Filter</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
