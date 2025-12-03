import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Star, MapPin, Clock, Shield, Package, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductGrid } from "@/components/product-grid";
import type { User, ProductWithSeller } from "@shared/schema";

export default function SellerProfile() {
  const [, params] = useRoute("/seller/:id");
  const sellerId = params?.id;

  const { data: seller, isLoading: sellerLoading } = useQuery<User>({
    queryKey: ["/api/users", sellerId],
    enabled: !!sellerId,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<ProductWithSeller[]>({
    queryKey: ["/api/products", { sellerId }],
    enabled: !!sellerId,
  });

  if (sellerLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Penjual Tidak Ditemukan</h1>
          <p className="text-muted-foreground">
            Profil penjual yang Anda cari tidak tersedia.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const totalSold = products.reduce((sum, p) => sum + p.soldCount, 0);
  const totalViews = products.reduce((sum, p) => sum + p.views, 0);
  const activeProducts = products.filter((p) => p.isActive).length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Seller Header */}
        <div className="bg-gradient-to-br from-primary/10 to-transparent">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={seller.profileImageUrl || undefined} className="object-cover" />
                    <AvatarFallback className="text-3xl">
                      {seller.firstName?.[0] || "S"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-bold" data-testid="text-seller-name">
                        {seller.firstName || "Seller"} {seller.lastName || ""}
                      </h1>
                      <Badge className="bg-green-500/10 text-green-600">
                        <Shield className="h-3 w-3 mr-1" />
                        Terverifikasi
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-foreground">4.8</span>
                        <span>(128 ulasan)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{seller.city || "Indonesia"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          Bergabung{" "}
                          {new Date(seller.createdAt!).toLocaleDateString("id-ID", {
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-6">
                      <div>
                        <p className="text-2xl font-bold text-primary">{activeProducts}</p>
                        <p className="text-sm text-muted-foreground">Produk</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">{totalSold}</p>
                        <p className="text-sm text-muted-foreground">Terjual</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">{totalViews}</p>
                        <p className="text-sm text-muted-foreground">Dilihat</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button data-testid="button-chat-seller">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat Penjual
                    </Button>
                    <Button variant="outline" data-testid="button-follow-seller">
                      Ikuti
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Products */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Tabs defaultValue="products">
            <TabsList className="mb-6">
              <TabsTrigger value="products" data-testid="tab-seller-products">
                <Package className="h-4 w-4 mr-2" />
                Produk ({activeProducts})
              </TabsTrigger>
              <TabsTrigger value="reviews" data-testid="tab-seller-reviews">
                <Star className="h-4 w-4 mr-2" />
                Ulasan
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <ProductGrid
                products={products}
                isLoading={productsLoading}
                emptyMessage="Penjual ini belum memiliki produk"
              />
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Belum ada ulasan untuk penjual ini.
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
