import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, CreditCard, Truck, Shield, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { CartItemWithProduct } from "@shared/schema";

const checkoutSchema = z.object({
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  phone: z.string().min(10, "Nomor telepon tidak valid"),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
  city: z.string().min(2, "Kota tidak valid"),
  notes: z.string().optional(),
  paymentMethod: z.enum(["transfer", "cod"]),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Silakan login",
        description: "Anda perlu login untuk checkout",
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

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
      notes: "",
      paymentMethod: "transfer",
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: CheckoutForm) => {
      const response = await apiRequest("POST", "/api/orders", {
        shippingAddress: data.address,
        shippingCity: data.city,
        shippingPhone: data.phone,
        notes: data.notes,
      });
      return response.json();
    },
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Pesanan Berhasil!",
        description: `Pesanan #${order.id} telah dibuat`,
      });
      setLocation(`/orders/${order.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal membuat pesanan",
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

  const onSubmit = (data: CheckoutForm) => {
    if (cartItems.length === 0) {
      toast({
        title: "Keranjang kosong",
        description: "Tambahkan produk ke keranjang terlebih dahulu",
        variant: "destructive",
      });
      return;
    }
    createOrderMutation.mutate(data);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-48" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-64 bg-muted rounded-xl" />
                <div className="h-48 bg-muted rounded-xl" />
              </div>
              <div className="h-80 bg-muted rounded-xl" />
            </div>
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
        <main className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Keranjang Kosong</h1>
          <p className="text-muted-foreground mb-8">
            Tambahkan produk ke keranjang terlebih dahulu
          </p>
          <Button asChild>
            <Link href="/">Belanja Sekarang</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-4" asChild>
          <Link href="/cart">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Keranjang
          </Link>
        </Button>

        <h1 className="text-2xl font-bold mb-6" data-testid="text-checkout-title">
          Checkout
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Alamat Pengiriman
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nama Lengkap</FormLabel>
                            <FormControl>
                              <Input placeholder="Nama penerima" {...field} data-testid="input-fullname" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nomor Telepon</FormLabel>
                            <FormControl>
                              <Input placeholder="08xxxxxxxxxx" {...field} data-testid="input-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alamat Lengkap</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                              {...field}
                              data-testid="input-address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kota</FormLabel>
                          <FormControl>
                            <Input placeholder="Kota/Kabupaten" {...field} data-testid="input-city" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Catatan (Opsional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Catatan untuk penjual atau kurir" {...field} data-testid="input-notes" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Metode Pembayaran
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-3"
                            >
                              <div className="flex items-center space-x-3 border rounded-lg p-4 hover-elevate cursor-pointer">
                                <RadioGroupItem value="transfer" id="transfer" data-testid="radio-transfer" />
                                <Label htmlFor="transfer" className="flex-1 cursor-pointer">
                                  <div className="font-medium">Transfer Bank</div>
                                  <div className="text-sm text-muted-foreground">
                                    BCA, Mandiri, BNI, BRI
                                  </div>
                                </Label>
                              </div>
                              <div className="flex items-center space-x-3 border rounded-lg p-4 hover-elevate cursor-pointer">
                                <RadioGroupItem value="cod" id="cod" data-testid="radio-cod" />
                                <Label htmlFor="cod" className="flex-1 cursor-pointer">
                                  <div className="font-medium">Bayar di Tempat (COD)</div>
                                  <div className="text-sm text-muted-foreground">
                                    Bayar saat barang diterima
                                  </div>
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Order Items Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" />
                      Pesanan ({cartItems.length} produk)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                          <img
                            src={item.product.images?.[0] || "https://placehold.co/64x64?text=No+Image"}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium line-clamp-1">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x {formatPrice(item.product.price)}
                          </p>
                        </div>
                        <p className="font-medium">
                          {formatPrice(parseFloat(item.product.price) * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
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
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ongkos Kirim</span>
                        <span className="text-green-600">Gratis</span>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex justify-between font-semibold text-lg mb-6">
                      <span>Total Pembayaran</span>
                      <span className="text-primary" data-testid="text-checkout-total">
                        {formatPrice(subtotal)}
                      </span>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={createOrderMutation.isPending}
                      data-testid="button-place-order"
                    >
                      {createOrderMutation.isPending ? "Memproses..." : "Buat Pesanan"}
                    </Button>

                    <div className="flex items-center gap-2 justify-center mt-4 text-xs text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span>Transaksi Aman & Terlindungi</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </main>

      <Footer />
    </div>
  );
}
