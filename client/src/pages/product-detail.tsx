import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Share2, 
  ShoppingCart, 
  MessageCircle,
  MapPin,
  Clock,
  Eye,
  Shield,
  Star,
  Check,
  Minus,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductGrid } from "@/components/product-grid";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ProductWithSeller } from "@shared/schema";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id;
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery<ProductWithSeller>({
    queryKey: ["/api/products", productId],
    enabled: !!productId,
  });

  const { data: relatedProducts = [] } = useQuery<ProductWithSeller[]>({
    queryKey: ["/api/products", { category: product?.categoryId, exclude: productId }],
    enabled: !!product?.categoryId,
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/cart", {
        productId: Number(productId),
        quantity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Berhasil!",
        description: "Produk ditambahkan ke keranjang",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    addToCartMutation.mutate();
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    addToCartMutation.mutate();
    window.location.href = "/checkout";
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case "seperti baru":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "bagus":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "layak pakai":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Produk Tidak Ditemukan</h1>
          <p className="text-muted-foreground mb-8">
            Produk yang Anda cari tidak tersedia atau sudah dihapus.
          </p>
          <Button asChild>
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ["https://placehold.co/600x600?text=No+Image"];

  const discount = product.originalPrice
    ? Math.round(
        (1 - parseFloat(product.price) / parseFloat(product.originalPrice)) * 100
      )
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Beranda</Link>
            <span>/</span>
            {product.category && (
              <>
                <Link href={`/?category=${product.category.slug}`} className="hover:text-foreground">
                  {product.category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>

        {/* Product Details */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                <img
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  data-testid="img-product-main"
                />
                
                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                      onClick={() => setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                      data-testid="button-prev-image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                      onClick={() => setSelectedImageIndex((prev) => (prev + 1) % images.length)}
                      data-testid="button-next-image"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </>
                )}

                {/* Condition Badge */}
                <Badge className={`absolute top-4 left-4 ${getConditionColor(product.condition)}`}>
                  {product.condition}
                </Badge>

                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button variant="ghost" size="icon" className="bg-background/80 backdrop-blur-sm" data-testid="button-wishlist">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="bg-background/80 backdrop-blur-sm" data-testid="button-share">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === selectedImageIndex ? "border-primary" : "border-transparent"
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                      data-testid={`button-thumbnail-${index}`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-2" data-testid="text-product-name">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{product.views} dilihat</span>
                  </div>
                  {product.soldCount > 0 && (
                    <span>{product.soldCount} terjual</span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-primary" data-testid="text-product-price">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  {discount > 0 && (
                    <Badge className="bg-destructive text-destructive-foreground">
                      -{discount}%
                    </Badge>
                  )}
                </div>
              </div>

              <Separator />

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{product.location || "Indonesia"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Garansi 7 Hari</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Kuantitas</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-r-none"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      data-testid="button-qty-minus"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium" data-testid="text-quantity">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-l-none"
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      disabled={quantity >= product.stock}
                      data-testid="button-qty-plus"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Stok: {product.stock}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending}
                  data-testid="button-add-to-cart"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Keranjang
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleBuyNow}
                  disabled={addToCartMutation.isPending}
                  data-testid="button-buy-now"
                >
                  Beli Sekarang
                </Button>
              </div>

              <Separator />

              {/* Seller Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={product.seller?.profileImageUrl || undefined} className="object-cover" />
                        <AvatarFallback>
                          {product.seller?.firstName?.[0] || "S"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium" data-testid="text-seller-name">
                          {product.seller?.firstName || "Seller"}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>4.8</span>
                          </div>
                          <span>|</span>
                          <span>Online 2 jam lalu</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" data-testid="button-chat-seller">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                      <Button variant="outline" size="sm" asChild data-testid="button-view-store">
                        <Link href={`/seller/${product.sellerId}`}>
                          Lihat Toko
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="description" data-testid="tab-description">Deskripsi</TabsTrigger>
                <TabsTrigger value="specs" data-testid="tab-specs">Spesifikasi</TabsTrigger>
                <TabsTrigger value="reviews" data-testid="tab-reviews">Ulasan</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-6">
                <Card>
                  <CardContent className="p-6 prose dark:prose-invert max-w-none">
                    <p data-testid="text-product-description">
                      {product.description || "Tidak ada deskripsi tersedia untuk produk ini."}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="specs" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Kondisi</span>
                        <span className="font-medium">{product.condition}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Stok</span>
                        <span className="font-medium">{product.stock} item</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Kategori</span>
                        <span className="font-medium">{product.category?.name || "-"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Lokasi</span>
                        <span className="font-medium">{product.location || "Indonesia"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    Belum ada ulasan untuk produk ini.
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-bold mb-6">Produk Serupa</h2>
              <ProductGrid products={relatedProducts.slice(0, 5)} />
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
