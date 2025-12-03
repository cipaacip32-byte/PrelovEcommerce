import { useEffect } from "react";
import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Package, ArrowLeft, MapPin, Phone, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { OrderWithItems } from "@shared/schema";

export default function Orders() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [matchDetail, paramsDetail] = useRoute("/orders/:id");
  const orderId = paramsDetail?.id;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Silakan login",
        description: "Anda perlu login untuk melihat pesanan",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: orders = [], isLoading } = useQuery<OrderWithItems[]>({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated && !orderId,
  });

  const { data: orderDetail, isLoading: detailLoading } = useQuery<OrderWithItems>({
    queryKey: ["/api/orders", orderId],
    enabled: isAuthenticated && !!orderId,
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

  if (authLoading || isLoading || detailLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-48" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-xl" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Order Detail View
  if (orderId && orderDetail) {
    const statusSteps = ["pending", "paid", "shipped", "completed"];
    const currentStep = statusSteps.indexOf(orderDetail.status);

    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
          <Button variant="ghost" className="mb-4" asChild>
            <Link href="/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar Pesanan
            </Link>
          </Button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-order-id">
                Pesanan #{orderDetail.id}
              </h1>
              <p className="text-muted-foreground">
                {new Date(orderDetail.createdAt!).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <Badge className={getStatusColor(orderDetail.status)} data-testid="badge-order-status">
              {getStatusLabel(orderDetail.status)}
            </Badge>
          </div>

          {/* Status Timeline */}
          {orderDetail.status !== "cancelled" && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  {statusSteps.map((step, index) => {
                    const isActive = index <= currentStep;
                    const isCompleted = index < currentStep;
                    return (
                      <div key={step} className="flex flex-col items-center flex-1">
                        <div className="flex items-center w-full">
                          {index > 0 && (
                            <div
                              className={`h-1 flex-1 ${
                                isActive ? "bg-primary" : "bg-muted"
                              }`}
                            />
                          )}
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <span>{index + 1}</span>
                            )}
                          </div>
                          {index < statusSteps.length - 1 && (
                            <div
                              className={`h-1 flex-1 ${
                                isCompleted ? "bg-primary" : "bg-muted"
                              }`}
                            />
                          )}
                        </div>
                        <span
                          className={`text-xs mt-2 text-center ${
                            isActive ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {getStatusLabel(step)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Shipping Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Alamat Pengiriman
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium">{orderDetail.shippingAddress}</p>
                <p className="text-muted-foreground">{orderDetail.shippingCity}</p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {orderDetail.shippingPhone}
                </div>
                {orderDetail.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">
                      Catatan: {orderDetail.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(orderDetail.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ongkos Kirim</span>
                  <span className="text-green-600">Gratis</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary" data-testid="text-order-total">
                    {formatPrice(orderDetail.totalAmount)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Produk Dipesan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderDetail.items?.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img
                      src={item.product?.images?.[0] || "https://placehold.co/80x80?text=No+Image"}
                      alt={item.product?.name || "Product"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product?.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} x {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="font-medium">
                    {formatPrice(parseFloat(item.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    );
  }

  // Orders List View
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6" data-testid="text-orders-title">
          Pesanan Saya
        </h1>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">Belum ada pesanan</h2>
              <p className="text-muted-foreground mb-6">
                Pesanan yang kamu buat akan muncul di sini
              </p>
              <Button asChild>
                <Link href="/">Mulai Belanja</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover-elevate" data-testid={`card-order-${order.id}`}>
                <CardContent className="p-4">
                  <Link href={`/orders/${order.id}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Pesanan #{order.id}</span>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {new Date(order.createdAt!).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {order.items?.slice(0, 3).map((item, i) => (
                            <div
                              key={i}
                              className="w-12 h-12 rounded-lg overflow-hidden bg-muted border-2 border-background"
                            >
                              <img
                                src={item.product?.images?.[0] || "https://placehold.co/48x48?text=No+Image"}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {order.items && order.items.length > 3 && (
                            <div className="w-12 h-12 rounded-lg bg-muted border-2 border-background flex items-center justify-center text-sm text-muted-foreground">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0} produk
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-bold text-primary">
                          {formatPrice(order.totalAmount)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
