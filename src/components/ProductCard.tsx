import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, AlertTriangle } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  type: string;
  price: number;
  volume?: string;
  imageUrl?: string;
  inStock: boolean;
  stockQuantity?: number;
  onAddToCart: () => void;
}

export const ProductCard = ({
  id,
  name,
  type,
  price,
  volume,
  imageUrl,
  inStock,
  stockQuantity,
  onAddToCart,
}: ProductCardProps) => {
  // Determine stock status
  const getStockStatus = () => {
    if (!inStock || stockQuantity === 0) {
      return { label: "Indisponível", variant: "destructive" as const, canBuy: false };
    }
    if (stockQuantity && stockQuantity <= 5) {
      return { label: `Últimas ${stockQuantity} un.`, variant: "secondary" as const, canBuy: true };
    }
    return { label: "Disponível", variant: "default" as const, canBuy: true };
  };

  const stockStatus = getStockStatus();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart();
  };

  return (
    <Link to={`/produto/${id}`} className="block h-full">
      <Card className="group overflow-hidden hover:shadow-elegant transition-all duration-300 flex flex-col h-full cursor-pointer">
        {/* Product Image */}
        <div className="relative aspect-square bg-muted/50 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-16 h-16 text-muted-foreground/30" />
            </div>
          )}

          {/* Stock Badge */}
          <Badge
            variant={stockStatus.variant}
            className="absolute top-3 right-3"
          >
            {stockStatus.label}
          </Badge>
        </div>

        <CardContent className="flex-1 p-4 space-y-2">
          {/* Category */}
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {type}
          </p>

          {/* Name */}
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {name}
          </h3>

          {/* Volume if available */}
          {volume && (
            <p className="text-sm text-muted-foreground">{volume}</p>
          )}

          {/* Price - Always visible */}
          <div className="pt-2">
            <span className="text-2xl font-bold text-primary">
              R$ {price.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={!stockStatus.canBuy}
            className="w-full gap-2"
            variant={stockStatus.canBuy ? "default" : "secondary"}
          >
            {stockStatus.canBuy ? (
              <>
                <Plus className="w-4 h-4" />
                Adicionar
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4" />
                Indisponível
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};
