import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export const CartDrawer = () => {
  const { items, removeItem, updateQuantity, total, itemCount, clearCart } = useCart();
  const navigate = useNavigate();

  const deliveryFee = 5.00; // Taxa de entrega fixa por enquanto
  const minOrderValue = 30.00;
  const isMinOrderMet = total >= minOrderValue;

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleViewCart = () => {
    navigate("/carrinho");
  };

  const formatPrice = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {itemCount > 0 && (
            <Badge
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent text-accent-foreground"
            >
              {itemCount > 9 ? "9+" : itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Meu Carrinho
          </SheetTitle>
          <SheetDescription>
            {itemCount === 0
              ? "Seu carrinho está vazio"
              : `${itemCount} item(s) no carrinho`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto mt-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingCart className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-4">
                Adicione bebidas ao carrinho
              </p>
              <Button variant="outline" onClick={() => navigate("/catalogo")}>
                Ver Catálogo
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-card"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">{item.type}</p>
                    <p className="text-sm font-semibold text-primary mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t pt-4 mt-4 space-y-4">
            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Entrega</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total + deliveryFee)}</span>
              </div>
            </div>

            {/* Min Order Warning */}
            {!isMinOrderMet && (
              <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                <p className="text-xs text-accent-foreground">
                  ⚠️ Pedido mínimo: {formatPrice(minOrderValue)}.
                  Faltam {formatPrice(minOrderValue - total)}.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              <Button
                onClick={handleCheckout}
                className="w-full gap-2"
                size="lg"
                disabled={!isMinOrderMet}
              >
                Finalizar Pedido
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleViewCart}
                variant="outline"
                className="w-full"
              >
                Ver Carrinho Completo
              </Button>
              <Button
                onClick={clearCart}
                variant="ghost"
                className="w-full text-muted-foreground"
                size="sm"
              >
                Limpar Carrinho
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
