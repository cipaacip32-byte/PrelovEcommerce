import { Link } from "wouter";
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      {/* Environmental Message Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm sm:text-base font-medium">
            Setiap pembelian preloved membantu mengurangi limbah tekstil hingga 70% dan menghemat 2.700 liter air!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Prelovin</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Platform jual-beli barang preloved terpercaya di Indonesia. 
              Temukan barang berkualitas dengan harga bersahabat sambil berkontribusi 
              untuk lingkungan yang lebih baik.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" data-testid="button-social-facebook">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-social-instagram">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-social-twitter">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Kategori</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/?category=elektronik" className="hover:text-foreground transition-colors" data-testid="link-footer-electronics">
                  Elektronik
                </Link>
              </li>
              <li>
                <Link href="/?category=fashion" className="hover:text-foreground transition-colors" data-testid="link-footer-fashion">
                  Fashion
                </Link>
              </li>
              <li>
                <Link href="/?category=furniture" className="hover:text-foreground transition-colors" data-testid="link-footer-furniture">
                  Furniture
                </Link>
              </li>
              <li>
                <Link href="/?category=hobi-koleksi" className="hover:text-foreground transition-colors" data-testid="link-footer-hobby">
                  Hobi & Koleksi
                </Link>
              </li>
              <li>
                <Link href="/?category=buku" className="hover:text-foreground transition-colors" data-testid="link-footer-books">
                  Buku
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Bantuan</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/help/how-to-buy" className="hover:text-foreground transition-colors" data-testid="link-footer-how-to-buy">
                  Cara Membeli
                </Link>
              </li>
              <li>
                <Link href="/help/how-to-sell" className="hover:text-foreground transition-colors" data-testid="link-footer-how-to-sell">
                  Cara Menjual
                </Link>
              </li>
              <li>
                <Link href="/help/shipping" className="hover:text-foreground transition-colors" data-testid="link-footer-shipping">
                  Pengiriman
                </Link>
              </li>
              <li>
                <Link href="/help/faq" className="hover:text-foreground transition-colors" data-testid="link-footer-faq">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/help/contact" className="hover:text-foreground transition-colors" data-testid="link-footer-contact">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Dapatkan Promo</h3>
            <p className="text-sm text-muted-foreground">
              Daftar untuk mendapatkan informasi promo dan barang terbaru.
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Email kamu" 
                className="flex-1"
                data-testid="input-newsletter-email"
              />
              <Button data-testid="button-newsletter-subscribe">
                Daftar
              </Button>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@prelovin.id</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+62 812 3456 7890</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Prelovin. Semua hak dilindungi.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors" data-testid="link-footer-privacy">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors" data-testid="link-footer-terms">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
