import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Header } from "@/components/header";
import { CategoryNav } from "@/components/category-nav";
import { HeroBanner } from "@/components/hero-banner";
import { ProductGrid } from "@/components/product-grid";
import { SearchFilters } from "@/components/search-filters";
import { Footer } from "@/components/footer";
import type { ProductWithSeller } from "@shared/schema";

export default function Home() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    search: searchParams.get("search") || "",
    condition: [] as string[],
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    sortBy: "newest",
  });

  const { data: products = [], isLoading } = useQuery<ProductWithSeller[]>({
    queryKey: ["/api/products", filters],
  });

  const handleSearch = (query: string) => {
    setFilters({ ...filters, search: query });
  };

  const handleCategoryChange = (category: string) => {
    setFilters({ ...filters, category });
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category) {
      result = result.filter((p) => p.category?.slug === filters.category);
    }

    if (filters.condition && filters.condition.length > 0) {
      result = result.filter((p) =>
        filters.condition.some(
          (c) => p.condition.toLowerCase().replace(" ", "-") === c
        )
      );
    }

    if (filters.minPrice !== undefined) {
      result = result.filter((p) => parseFloat(p.price) >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      result = result.filter((p) => parseFloat(p.price) <= filters.maxPrice!);
    }

    switch (filters.sortBy) {
      case "price-low":
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high":
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "most-viewed":
        result.sort((a, b) => b.views - a.views);
        break;
      default:
        result.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
    }

    return result;
  }, [products, filters]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onSearch={handleSearch} searchQuery={filters.search} />
      <CategoryNav 
        activeCategory={filters.category} 
        onCategoryChange={handleCategoryChange} 
      />

      <main className="flex-1">
        {/* Hero Banner */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <HeroBanner />
        </div>

        {/* Products Section */}
        <section id="products" className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold" data-testid="text-products-title">
                {filters.search
                  ? `Hasil pencarian "${filters.search}"`
                  : filters.category
                  ? `Kategori: ${filters.category.replace("-", " ")}`
                  : "Rekomendasi Untukmu"}
              </h2>
              <p className="text-muted-foreground text-sm mt-1" data-testid="text-products-count">
                {filteredProducts.length} produk ditemukan
              </p>
            </div>
            <div className="lg:hidden">
              <SearchFilters filters={filters} onFilterChange={handleFilterChange} />
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop Filters */}
            <SearchFilters filters={filters} onFilterChange={handleFilterChange} />

            {/* Product Grid */}
            <div className="flex-1">
              <ProductGrid
                products={filteredProducts}
                isLoading={isLoading}
                emptyMessage={
                  filters.search
                    ? `Tidak ada produk yang cocok dengan "${filters.search}"`
                    : "Belum ada produk dalam kategori ini"
                }
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
