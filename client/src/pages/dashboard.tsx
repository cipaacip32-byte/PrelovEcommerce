import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Package, 
  ShoppingBag, 
  Star, 
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  Plus,
  Settings,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Product, Order } from "@shared/schema";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Silakan login",
        description: "Anda perlu login untuk mengakses dashboard",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: myProducts = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/my-products"],
    enabled: isAuthenticated,
  });

  const { data: myOrders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated,
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      await apiRequest("DELETE", `/api/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-products"] });
      toast({
        title: "Produk dihapus",
        description: "Produk berhasil dihapus dari toko Anda",
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600";
      case "paid":
        return "bg-blue-500/10 text-blue-600";
      case "shipped":
        return "bg-purple-500/10 text-purple-600";
      case "completed":
        return "bg-green-500/10 text-green-600";
      case "cancelled":
        return "bg-red-500/10 text-red-600";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Menunggu Pembayaran",
      paid: "Dibayar",
      shipped: "Dikirim",
      completed: "Selesai",
      cancelled: "Dibatalkan",
    };
    return labels[status] || status;
  };

  const stats = [
    {
      title: "Total Produk",
      value: myProducts.length,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Produk Terjual",
      value: myProducts.reduce((sum, p) => sum + p.soldCount, 0),
      icon: ShoppingBag,
      color: "text-green-600",
    },
    {
      title: "Total Dilihat",
      value: myProducts.reduce((sum, p) => sum + p.views, 0),
      icon: Eye,
      color: "text-purple-600",
    },
    {
      title: "Rating Toko",
      value: "4.8",
      icon: Star,
      color: "text-yellow-600",
    },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-48" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-xl" />
              ))}
            </div>
            <div className="h-96 bg-muted rounded-xl" />
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
        {/* Profile Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.profileImageUrl || undefined} className="object-cover" />
              <AvatarFallback className="text-xl">
                {user?.firstName?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-dashboard-welcome">
                Halo, {user?.firstName || "Seller"}!
              </h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Pengaturan
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold" data-testid={`text-stat-${stat.title}`}>
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 bg-muted rounded-xl ${stat.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products" data-testid="tab-my-products">
              Produk Saya
            </TabsTrigger>
            <TabsTrigger value="orders" data-testid="tab-my-orders">
              Pesanan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Produk Saya</CardTitle>
                <Button asChild data-testid="button-add-product">
                  <Link href="/sell">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Produk
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-24" />
                    ))}
                  </div>
                ) : myProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">Belum ada produk</h3>
                    <p className="text-muted-foreground mb-4">
                      Mulai jual barang preloved-mu sekarang
                    </p>
                    <Button asChild>
                      <Link href="/sell">Jual Barang</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                        data-testid={`product-item-${product.id}`}
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                          <img
                            src={product.images?.[0] || "https://placehold.co/80x80?text=No+Image"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium line-clamp-1">{product.name}</h4>
                          <p className="text-lg font-bold text-primary">
                            {formatPrice(product.price)}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Stok: {product.stock}</span>
                            <span>Dilihat: {product.views}</span>
                            <span>Terjual: {product.soldCount}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={product.isActive ? "bg-green-500/10 text-green-600" : "bg-muted"}>
                            {product.isActive ? "Aktif" : "Nonaktif"}
                          </Badge>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/product/${product.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/edit-product/${product.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Produk?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tindakan ini tidak dapat dibatalkan. Produk akan dihapus secara permanen.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-destructive-foreground"
                                  onClick={() => deleteProductMutation.mutate(product.id)}
                                >
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Pesanan Saya</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-24" />
                    ))}
                  </div>
                ) : myOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">Belum ada pesanan</h3>
                    <p className="text-muted-foreground mb-4">
                      Pesanan dari pembeli akan muncul di sini
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-4 border rounded-lg"
                        data-testid={`order-item-${order.id}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Pesanan #{order.id}</span>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusLabel(order.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {new Date(order.createdAt!).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                          <span className="font-bold text-primary">
                            {formatPrice(order.totalAmount)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
