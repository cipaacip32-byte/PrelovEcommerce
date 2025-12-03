import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, X, ImagePlus, Package, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Category } from "@shared/schema";

const productSchema = z.object({
  name: z.string().min(5, "Nama produk minimal 5 karakter").max(255),
  description: z.string().min(20, "Deskripsi minimal 20 karakter"),
  price: z.string().min(1, "Harga harus diisi").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Harga harus lebih dari 0"),
  originalPrice: z.string().optional(),
  categoryId: z.string().min(1, "Pilih kategori"),
  condition: z.enum(["Seperti Baru", "Bagus", "Layak Pakai"]),
  stock: z.string().min(1, "Stok harus diisi").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Stok minimal 1"),
  location: z.string().min(2, "Lokasi harus diisi"),
  images: z.array(z.string()).min(1, "Minimal 1 foto produk"),
});

type ProductForm = z.infer<typeof productSchema>;

const conditions = [
  { value: "Seperti Baru", label: "Seperti Baru", description: "Hampir tidak ada tanda pemakaian" },
  { value: "Bagus", label: "Bagus", description: "Ada sedikit tanda pemakaian normal" },
  { value: "Layak Pakai", label: "Layak Pakai", description: "Ada tanda pemakaian yang terlihat" },
];

export default function Sell() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Silakan login",
        description: "Anda perlu login untuk menjual barang",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      categoryId: "",
      condition: "Bagus",
      stock: "1",
      location: "",
      images: [],
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductForm) => {
      const response = await apiRequest("POST", "/api/products", {
        ...data,
        price: data.price,
        originalPrice: data.originalPrice || null,
        categoryId: parseInt(data.categoryId),
        stock: parseInt(data.stock),
      });
      return response.json();
    },
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Produk berhasil ditambahkan!",
        description: "Produkmu sekarang sudah bisa dilihat pembeli",
      });
      setLocation(`/product/${product.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal menambahkan produk",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleImageAdd = () => {
    const url = prompt("Masukkan URL gambar:");
    if (url) {
      const newImages = [...imageUrls, url];
      setImageUrls(newImages);
      form.setValue("images", newImages);
    }
  };

  const handleImageRemove = (index: number) => {
    const newImages = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImages);
    form.setValue("images", newImages);
  };

  const onSubmit = (data: ProductForm) => {
    createProductMutation.mutate(data);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-48" />
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

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-4" onClick={() => setLocation("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-sell-title">
              Jual Barang Preloved
            </h1>
            <p className="text-muted-foreground">
              Isi detail produk untuk mulai menjual
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Foto Produk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {imageUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden bg-muted group"
                    >
                      <img
                        src={url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleImageRemove(index)}
                        data-testid={`button-remove-image-${index}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                          Foto Utama
                        </span>
                      )}
                    </div>
                  ))}
                  {imageUrls.length < 8 && (
                    <button
                      type="button"
                      onClick={handleImageAdd}
                      className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors"
                      data-testid="button-add-image"
                    >
                      <ImagePlus className="h-8 w-8 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Tambah Foto</span>
                    </button>
                  )}
                </div>
                {form.formState.errors.images && (
                  <p className="text-sm text-destructive mt-2">
                    {form.formState.errors.images.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-3">
                  Tambah hingga 8 foto. Foto pertama menjadi foto utama.
                </p>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detail Produk</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Produk</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: iPhone 13 Pro Max 256GB Bekas"
                          {...field}
                          data-testid="input-product-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Jelaskan kondisi, spesifikasi, dan alasan menjual produk ini..."
                          className="min-h-[120px]"
                          {...field}
                          data-testid="input-product-description"
                        />
                      </FormControl>
                      <FormDescription>
                        Deskripsi yang detail akan membantu pembeli memahami produkmu
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategori</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-category">
                              <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lokasi</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Contoh: Jakarta Selatan"
                            {...field}
                            data-testid="input-location"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kondisi</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid sm:grid-cols-3 gap-4"
                        >
                          {conditions.map((condition) => (
                            <div key={condition.value} className="relative">
                              <RadioGroupItem
                                value={condition.value}
                                id={condition.value}
                                className="peer sr-only"
                                data-testid={`radio-condition-${condition.value}`}
                              />
                              <Label
                                htmlFor={condition.value}
                                className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                              >
                                <span className="font-medium">{condition.label}</span>
                                <span className="text-xs text-muted-foreground text-center mt-1">
                                  {condition.description}
                                </span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Harga & Stok</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Harga Jual</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              Rp
                            </span>
                            <Input
                              type="number"
                              placeholder="0"
                              className="pl-10"
                              {...field}
                              data-testid="input-price"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="originalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Harga Asli (Opsional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              Rp
                            </span>
                            <Input
                              type="number"
                              placeholder="0"
                              className="pl-10"
                              {...field}
                              data-testid="input-original-price"
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Untuk menampilkan diskon
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stok</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1"
                            {...field}
                            data-testid="input-stock"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setLocation("/")}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={createProductMutation.isPending}
                data-testid="button-submit-product"
              >
                {createProductMutation.isPending ? "Menyimpan..." : "Posting Produk"}
              </Button>
            </div>
          </form>
        </Form>
      </main>

      <Footer />
    </div>
  );
}
