import { Link } from "wouter";
import { Heart, MapPin, Star, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ProductWithSeller } from "@shared/schema";

interface ProductCardProps {
  product: ProductWithSeller;
  onWishlistToggle?: (productId: number) => void;
  isWishlisted?: boolean;
}

export function ProductCard({ product, onWishlistToggle, isWishlisted = false }: ProductCardProps) {
  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'seperti baru':
        return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'bagus':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'layak pakai':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const discount = product.originalPrice 
    ? Math.round((1 - parseFloat(product.price) / parseFloat(product.originalPrice)) * 100)
    : 0;

  return (
    <Card className="group overflow-hidden hover-elevate" data-testid={`card-product-${product.id}`}>
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          
          {/* Condition Badge */}
          <Badge 
            className={`absolute top-2 left-2 ${getConditionColor(product.condition)}`}
            data-testid={`badge-condition-${product.id}`}
          >
            {product.condition}
          </Badge>

          {/* Discount Badge */}
          {discount > 0 && (
            <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
              -{discount}%
            </Badge>
          )}

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute bottom-2 right-2 h-8 w-8 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity ${
              isWishlisted ? 'text-destructive' : ''
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onWishlistToggle?.(product.id);
            }}
            data-testid={`button-wishlist-${product.id}`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </Link>

      <CardContent className="p-3">
        <Link href={`/product/${product.id}`}>
          <h3 
            className="font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem]"
            data-testid={`text-product-name-${product.id}`}
          >
            {product.name}
          </h3>
        </Link>

        <div className="flex flex-col gap-1">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span 
              className="text-lg font-bold text-primary"
              data-testid={`text-product-price-${product.id}`}
            >
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Location & Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-[80px]">
                {product.location || "Indonesia"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                <Eye className="h-3 w-3" />
                <span>{product.views}</span>
              </div>
              {product.soldCount > 0 && (
                <span>{product.soldCount} terjual</span>
              )}
            </div>
          </div>

          {/* Seller Info */}
          <div className="flex items-center gap-2 mt-2 pt-2 border-t">
            <Avatar className="h-5 w-5">
              <AvatarImage src={product.seller?.profileImageUrl || undefined} className="object-cover" />
              <AvatarFallback className="text-[8px]">
                {product.seller?.firstName?.[0] || 'S'}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">
              {product.seller?.firstName || 'Seller'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
