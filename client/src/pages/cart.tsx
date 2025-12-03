import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { CartItemWithProduct } from "@shared/schema";

export default function Cart() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Silakan login",
        description: "Anda perlu login untuk melihat keranjang",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: cartItems = [], isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
      await apiRequest("PATCH", `/api/cart/${itemId}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal memperbarui",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      await apiRequest("DELETE", `/api/cart/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Berhasil",
        description: "Produk dihapus dari keranjang",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal menghapus",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + parseFloat(item.product.price) * item.quantity;
  }, 0);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Keranjang Belanja</h1>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Skeleton className="w-24 h-24 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-6 w-1/3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2" data-testid="text-empty-cart-title">
              Keranjang Kosong
            </h1>
            <p className="text-muted-foreground mb-8">
              Belum ada produk di keranjang belanjamu
            </p>
            <Button asChild data-testid="button-start-shopping">
              <Link href="/">Mulai Belanja</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6" data-testid="text-cart-title">
          Keranjang Belanja ({cartItems.length})
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} data-testid={`card-cart-item-${item.id}`}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link href={`/product/${item.productId}`}>
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
                        <img
                          src={item.product.images?.[0] || "https://placehold.co/100x100?text=No+Image"}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.productId}`}>
                        <h3 className="font-medium line-clamp-2 mb-1" data-testid={`text-cart-item-name-${item.id}`}>
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.product.seller?.firstName || "Seller"}
                      </p>
                      <p className="text-lg font-bold text-primary" data-testid={`text-cart-item-price-${item.id}`}>
                        {formatPrice(item.product.price)}
                      </p>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeItemMutation.mutate(item.id)}
                        disabled={removeItemMutation.isPending}
                        data-testid={`button-remove-item-${item.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-r-none"
                          onClick={() =>
                            updateQuantityMutation.mutate({
                              itemId: item.id,
                              quantity: Math.max(1, item.quantity - 1),
                            })
                          }
                          disabled={item.quantity <= 1 || updateQuantityMutation.isPending}
                          data-testid={`button-qty-minus-${item.id}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm" data-testid={`text-qty-${item.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-l-none"
                          onClick={() =>
                            updateQuantityMutation.mutate({
                              itemId: item.id,
                              quantity: Math.min(item.product.stock, item.quantity + 1),
                            })
                          }
                          disabled={item.quantity >= item.product.stock || updateQuantityMutation.isPending}
                          data-testid={`button-qty-plus-${item.id}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="font-semibold mb-4">Ringkasan Pesanan</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Subtotal ({cartItems.reduce((a, b) => a + b.quantity, 0)} produk)
                    </span>
                    <span data-testid="text-subtotal">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ongkos Kirim</span>
                    <span className="text-green-600">Gratis</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between font-semibold text-lg mb-6">
                  <span>Total</span>
                  <span className="text-primary" data-testid="text-total">{formatPrice(subtotal)}</span>
                </div>

                <Button className="w-full" size="lg" asChild data-testid="button-checkout">
                  <Link href="/checkout">
                    Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Dengan melanjutkan, Anda menyetujui syarat dan ketentuan kami
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
