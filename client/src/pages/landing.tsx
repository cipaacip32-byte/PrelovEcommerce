import { Link } from "wouter";
import { ShoppingBag, Shield, Truck, Recycle, Star, Users, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const features = [
  {
    icon: Shield,
    title: "Transaksi Aman",
    description: "Pembayaran dilindungi dan garansi uang kembali untuk setiap transaksi.",
  },
  {
    icon: Truck,
    title: "Pengiriman Cepat",
    description: "Pilihan pengiriman dari berbagai ekspedisi terpercaya di Indonesia.",
  },
  {
    icon: Recycle,
    title: "Ramah Lingkungan",
    description: "Berkontribusi mengurangi limbah dengan membeli barang preloved.",
  },
  {
    icon: Users,
    title: "Komunitas Terpercaya",
    description: "Ribuan penjual terverifikasi dengan rating dan ulasan transparan.",
  },
];

const categories = [
  { name: "Elektronik", count: "12.5k+ Produk", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop" },
  { name: "Fashion", count: "25k+ Produk", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop" },
  { name: "Furniture", count: "5k+ Produk", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop" },
  { name: "Buku", count: "18k+ Produk", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=400&fit=crop" },
];

const stats = [
  { value: "50K+", label: "Produk Tersedia" },
  { value: "25K+", label: "Penjual Aktif" },
  { value: "100K+", label: "Transaksi Sukses" },
  { value: "4.8", label: "Rating Pengguna" },
];

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-emerald-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Recycle className="h-4 w-4" />
                Platform Jual-Beli Preloved #1 di Indonesia
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight" data-testid="text-landing-title">
                Barang Berkualitas,{" "}
                <span className="text-primary">Harga Bersahabat</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0" data-testid="text-landing-subtitle">
                Temukan ribuan barang preloved berkualitas dengan harga yang ramah di kantong. 
                Pilihan cerdas untuk bumi dan dompetmu!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" asChild data-testid="button-landing-explore">
                  <a href="/api/login">
                    Mulai Belanja
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild data-testid="button-landing-sell">
                  <a href="/api/login">
                    Jual Barangmu
                  </a>
                </Button>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-emerald-500/20 rounded-3xl blur-3xl" />
              <div className="relative grid grid-cols-2 gap-4">
                {categories.map((cat, index) => (
                  <Card 
                    key={cat.name} 
                    className={`overflow-hidden hover-elevate ${index % 2 === 1 ? 'mt-8' : ''}`}
                  >
                    <div className="aspect-square relative">
                      <img 
                        src={cat.image} 
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <p className="font-semibold">{cat.name}</p>
                        <p className="text-sm opacity-80">{cat.count}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-card">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-primary mb-1" data-testid={`text-stat-${stat.label}`}>
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Mengapa Memilih Prelovin?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Platform jual-beli preloved yang aman, mudah, dan terpercaya untuk semua kebutuhanmu.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="text-center p-6">
                  <CardContent className="pt-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Preloved Bukan Bekas — Kualitas Masih Memukau!
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Bergabunglah dengan ribuan pengguna yang sudah merasakan manfaat jual-beli barang preloved. 
              Hemat uang, ramah lingkungan!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary" asChild>
                <a href="/api/login" data-testid="button-cta-join">
                  Gabung Sekarang
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Apa Kata Mereka?</h2>
            <p className="text-muted-foreground">
              Pengalaman nyata dari pengguna Prelovin
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sari Dewi",
                role: "Pembeli",
                content: "Sangat puas dengan barang yang saya beli. Kondisinya persis seperti yang dijanjikan. Recommended!",
              },
              {
                name: "Budi Santoso",
                role: "Penjual",
                content: "Platform yang sangat membantu untuk menjual barang-barang yang sudah tidak terpakai. Proses cepat dan aman.",
              },
              {
                name: "Ani Wijaya",
                role: "Pembeli & Penjual",
                content: "Suka banget dengan konsep preloved ini. Selain hemat, juga membantu mengurangi sampah. Go green!",
              },
            ].map((testimonial) => (
              <Card key={testimonial.name} className="p-6">
                <CardContent className="pt-4">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-medium">
                        {testimonial.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
