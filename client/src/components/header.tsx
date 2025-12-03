import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, User, Menu, Heart, Bell, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import type { CartItem } from "@shared/schema";
import { useState } from "react";

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export function Header({ onSearch, searchQuery = "" }: HeaderProps) {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const { data: cartItems = [] } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
  });

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(localSearch);
    } else {
      setLocation(`/?search=${encodeURIComponent(localSearch)}`);
    }
  };

  const getUserInitials = () => {
    if (!user) return "U";
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.firstName) return user.firstName[0].toUpperCase();
    if (user.email) return user.email[0].toUpperCase();
    return "U";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center gap-4">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="flex items-center gap-2 text-lg font-medium hover-elevate p-2 rounded-md" data-testid="link-mobile-home">
                  <Package className="h-5 w-5" />
                  Beranda
                </Link>
                <Link href="/categories" className="flex items-center gap-2 text-lg font-medium hover-elevate p-2 rounded-md" data-testid="link-mobile-categories">
                  <Search className="h-5 w-5" />
                  Kategori
                </Link>
                {isAuthenticated && (
                  <>
                    <Link href="/sell" className="flex items-center gap-2 text-lg font-medium hover-elevate p-2 rounded-md" data-testid="link-mobile-sell">
                      <Package className="h-5 w-5" />
                      Jual Barang
                    </Link>
                    <Link href="/dashboard" className="flex items-center gap-2 text-lg font-medium hover-elevate p-2 rounded-md" data-testid="link-mobile-dashboard">
                      <User className="h-5 w-5" />
                      Dashboard
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="hidden sm:inline-block text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Prelovin
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari barang preloved..."
                className="pl-10 pr-4 w-full"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                data-testid="input-search"
              />
            </div>
          </form>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <>
                <Link href="/cart">
                  <Button variant="ghost" size="icon" className="relative" data-testid="button-cart">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <Badge 
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        data-testid="badge-cart-count"
                      >
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </Link>

                <Button variant="ghost" size="icon" data-testid="button-notifications">
                  <Bell className="h-5 w-5" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full" data-testid="button-user-menu">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || "User"} className="object-cover" />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center gap-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImageUrl || undefined} className="object-cover" />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium" data-testid="text-user-name">
                          {user?.firstName || user?.email || "User"}
                        </span>
                        <span className="text-xs text-muted-foreground" data-testid="text-user-email">
                          {user?.email}
                        </span>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" data-testid="link-dashboard">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/sell" data-testid="link-sell">
                        <Package className="mr-2 h-4 w-4" />
                        Jual Barang
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" data-testid="link-orders">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Pesanan Saya
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <a href="/api/logout" data-testid="button-logout">
                        Keluar
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild data-testid="button-login">
                  <a href="/api/login">Masuk</a>
                </Button>
                <Button asChild data-testid="button-register">
                  <a href="/api/login">Daftar</a>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-1">
            <ThemeToggle />
            {isAuthenticated && (
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative" data-testid="button-cart-mobile">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
