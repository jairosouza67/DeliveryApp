import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useNavigate, Link } from "react-router-dom";
import {
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    ArrowRight,
    ArrowLeft,
    Tag,
    Truck,
    Package
} from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const Cart = () => {
    const { items, removeItem, updateQuantity, total, itemCount, clearCart } = useCart();
    const navigate = useNavigate();
    const [cupom, setCupom] = useState("");
    const [observacoes, setObservacoes] = useState("");

    const deliveryFee = 5.00;
    const minOrderValue = 30.00;
    const isMinOrderMet = total >= minOrderValue;

    const formatPrice = (value: number) => {
        return `R$ ${value.toFixed(2).replace('.', ',')}`;
    };

    const handleCheckout = () => {
        // Could store observacoes in cart context or localStorage
        localStorage.setItem("orderNotes", observacoes);
        navigate("/checkout");
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 pb-20 md:pb-0">
                    <div className="container py-20">
                        <div className="max-w-md mx-auto text-center space-y-6">
                            <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
                                <ShoppingCart className="w-12 h-12 text-muted-foreground" />
                            </div>
                            <h1 className="text-2xl font-bold">Seu carrinho está vazio</h1>
                            <p className="text-muted-foreground">
                                Adicione bebidas ao carrinho para continuar
                            </p>
                            <Button asChild size="lg">
                                <Link to="/catalogo">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Ver Catálogo
                                </Link>
                            </Button>
                        </div>
                    </div>
                </main>
                <Footer />
                <MobileNav />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 pb-20 md:pb-0">
                {/* Page Header */}
                <section className="bg-muted/50 py-8 border-b">
                    <div className="container">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold">Meu Carrinho</h1>
                                <p className="text-muted-foreground">{itemCount} item(s)</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-8">
                    <div className="container">
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {items.map((item) => (
                                    <Card key={item.id}>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-4">
                                                {/* Product Image Placeholder */}
                                                <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                                                    <Package className="w-8 h-8 text-muted-foreground/30" />
                                                </div>

                                                {/* Product Info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-muted-foreground uppercase">
                                                        {item.type}
                                                    </p>
                                                    <h3 className="font-semibold truncate">{item.name}</h3>
                                                    <p className="text-lg font-bold text-primary mt-1">
                                                        {formatPrice(item.price)}
                                                    </p>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="w-10 text-center font-medium">
                                                        {item.quantity}
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                {/* Subtotal */}
                                                <div className="text-right min-w-[80px]">
                                                    <p className="text-sm text-muted-foreground">Subtotal</p>
                                                    <p className="font-semibold">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                </div>

                                                {/* Remove Button */}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-muted-foreground hover:text-destructive"
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                {/* Cupom & Observações */}
                                <Card>
                                    <CardContent className="p-4 space-y-4">
                                        {/* Cupom */}
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Código do cupom"
                                                    value={cupom}
                                                    onChange={(e) => setCupom(e.target.value)}
                                                    className="pl-10"
                                                />
                                            </div>
                                            <Button variant="outline">Aplicar</Button>
                                        </div>

                                        {/* Observações */}
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">
                                                Observações do pedido
                                            </label>
                                            <Textarea
                                                placeholder="Ex: Sem gelo, deixar na portaria..."
                                                value={observacoes}
                                                onChange={(e) => setObservacoes(e.target.value)}
                                                rows={3}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Clear Cart */}
                                <div className="flex justify-between items-center">
                                    <Button variant="ghost" asChild>
                                        <Link to="/catalogo">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Continuar comprando
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" onClick={clearCart} className="text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Limpar carrinho
                                    </Button>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <Card className="sticky top-24">
                                    <CardHeader>
                                        <CardTitle>Resumo do Pedido</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Subtotal ({itemCount} itens)
                                                </span>
                                                <span>{formatPrice(total)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground flex items-center gap-1">
                                                    <Truck className="w-4 h-4" />
                                                    Entrega
                                                </span>
                                                <span>{formatPrice(deliveryFee)}</span>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="flex justify-between text-xl font-bold">
                                            <span>Total</span>
                                            <span className="text-primary">{formatPrice(total + deliveryFee)}</span>
                                        </div>

                                        {!isMinOrderMet && (
                                            <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                                                <p className="text-sm text-center">
                                                    ⚠️ Pedido mínimo: {formatPrice(minOrderValue)}
                                                    <br />
                                                    <span className="text-muted-foreground">
                                                        Faltam {formatPrice(minOrderValue - total)}
                                                    </span>
                                                </p>
                                            </div>
                                        )}

                                        <Button
                                            onClick={handleCheckout}
                                            className="w-full gap-2"
                                            size="lg"
                                            disabled={!isMinOrderMet}
                                        >
                                            Ir para Checkout
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>

                                        <p className="text-xs text-center text-muted-foreground">
                                            🔒 Pagamento seguro com Pix ou cartão
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
            <MobileNav />
        </div>
    );
};

export default Cart;
