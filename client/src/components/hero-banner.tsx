import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Recycle, Heart, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const slides = [
  {
    id: 1,
    title: "Barang Berkualitas, Harga Bersahabat",
    subtitle: "Pilihan Cerdas untuk Bumi & Dompetmu!",
    description: "Temukan ribuan barang preloved berkualitas dengan harga yang ramah di kantong.",
    icon: Wallet,
    gradient: "from-primary/90 to-primary/60",
  },
  {
    id: 2,
    title: "Preloved Bukan Bekas",
    subtitle: "Kualitas Masih Memukau, Harga Lebih Ramah!",
    description: "Setiap barang telah dikurasi untuk memastikan kualitas terbaik.",
    icon: Heart,
    gradient: "from-emerald-600/90 to-emerald-500/60",
  },
  {
    id: 3,
    title: "Jual Barang Tak Terpakai",
    subtitle: "Ubah Barang Lama Jadi Uang Baru!",
    description: "Mudah, cepat, dan aman. Mulai jual barang preloved-mu sekarang.",
    icon: Recycle,
    gradient: "from-amber-600/90 to-amber-500/60",
  },
];

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="relative w-full overflow-hidden rounded-xl" data-testid="hero-banner">
      <div 
        className={`relative bg-gradient-to-br ${slide.gradient} transition-all duration-500`}
        style={{ aspectRatio: "21/9" }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8">
            <div className="flex-1 text-white text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Icon className="h-8 w-8" />
                </div>
              </div>
              <h1 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2"
                data-testid="text-hero-title"
              >
                {slide.title}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl font-medium mb-3 opacity-90">
                {slide.subtitle}
              </p>
              <p className="text-sm sm:text-base opacity-80 mb-6 max-w-lg">
                {slide.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Button 
                  size="lg" 
                  className="bg-white text-foreground border-white"
                  asChild
                  data-testid="button-hero-explore"
                >
                  <a href="/#products">Jelajahi Sekarang</a>
                </Button>
                {!isAuthenticated && (
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white/50 text-white bg-white/10 backdrop-blur-sm"
                    asChild
                    data-testid="button-hero-sell"
                  >
                    <a href="/api/login">Mulai Jualan</a>
                  </Button>
                )}
                {isAuthenticated && (
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white/50 text-white bg-white/10 backdrop-blur-sm"
                    asChild
                    data-testid="button-hero-sell-auth"
                  >
                    <a href="/sell">Jual Barangmu</a>
                  </Button>
                )}
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-white/10 rounded-full blur-2xl" />
                <div className="relative grid grid-cols-2 gap-4 p-6">
                  <div className="w-24 h-24 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center">
                    <Wallet className="h-10 w-10 text-white" />
                  </div>
                  <div className="w-24 h-24 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center">
                    <Heart className="h-10 w-10 text-white" />
                  </div>
                  <div className="w-24 h-24 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center">
                    <Recycle className="h-10 w-10 text-white" />
                  </div>
                  <div className="w-24 h-24 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold">
                    100%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/20 text-white backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity"
          onClick={goToPrevious}
          data-testid="button-hero-prev"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/20 text-white backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity"
          onClick={goToNext}
          data-testid="button-hero-next"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide 
                  ? 'w-8 bg-white' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              onClick={() => goToSlide(index)}
              data-testid={`button-hero-dot-${index}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
