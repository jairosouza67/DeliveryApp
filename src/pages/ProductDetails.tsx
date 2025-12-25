import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import {
    ArrowLeft,
    Plus,
    Minus,
    ShoppingCart,
    Package,
    Truck,
    Clock,
    Shield,
    AlertTriangle,
    Star,
    Zap,
} from "lucide-react";

interface Product {
    id: string;
    name: string;
    type: string;
    price: number;
    description: string | null;
    image_url: string | null;
    in_stock: boolean;
}

const ProductDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addItem } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            // Fetch the product
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw error;

            setProduct(data);

            // Fetch related products (same category, different id)
            if (data) {
                const { data: related } = await supabase
                    .from("products")
                    .select("*")
                    .eq("type", data.type)
                    .neq("id", data.id)
                    .eq("in_stock", true)
                    .limit(4);

                setRelatedProducts(related || []);
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            toast.error("Erro ao carregar produto");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (product) {
            for (let i = 0; i < quantity; i++) {
                addItem({
                    id: product.id,
                    name: product.name,
                    type: product.type,
                    price: product.price,
                    imageUrl: product.image_url || undefined,
                });
            }
            toast.success(`${quantity}x ${product.name} adicionado ao carrinho!`);
        }
    };

    const handleBuyNow = () => {
        if (product) {
            for (let i = 0; i < quantity; i++) {
                addItem({
                    id: product.id,
                    name: product.name,
                    type: product.type,
                    price: product.price,
                    imageUrl: product.image_url || undefined,
                });
            }
            navigate("/checkout");
        }
    };

    const incrementQuantity = () => setQuantity((q) => q + 1);
    const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="animate-pulse space-y-4">
                        <div className="w-64 h-64 bg-muted rounded-xl mx-auto" />
                        <div className="h-8 w-48 bg-muted rounded mx-auto" />
                        <div className="h-4 w-32 bg-muted rounded mx-auto" />
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <Package className="w-16 h-16 text-muted-foreground mx-auto" />
                        <h1 className="text-2xl font-bold">Produto não encontrado</h1>
                        <p className="text-muted-foreground">
                            O produto que você procura não existe ou foi removido.
                        </p>
                        <Button onClick={() => navigate("/catalogo")}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar ao Catálogo
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1">
                {/* Breadcrumb */}
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link to="/" className="hover:text-primary transition-colors">
                            Início
                        </Link>
                        <span>/</span>
                        <Link to="/catalogo" className="hover:text-primary transition-colors">
                            Catálogo
                        </Link>
                        <span>/</span>
                        <span className="text-foreground">{product.name}</span>
                    </div>
                </div>

                {/* Product Section */}
                <section className="container mx-auto px-4 pb-12">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Product Image */}
                        <div className="relative">
                            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted shadow-elegant">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-32 h-32 text-muted-foreground/30" />
                                    </div>
                                )}
                            </div>

                            {/* Stock Badge */}
                            <Badge
                                variant={product.in_stock ? "default" : "destructive"}
                                className="absolute top-4 right-4 text-sm px-3 py-1"
                            >
                                {product.in_stock ? "Disponível" : "Indisponível"}
                            </Badge>

                            {/* Back Button Mobile */}
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => navigate(-1)}
                                className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm lg:hidden"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            {/* Back Button Desktop */}
                            <Button
                                variant="ghost"
                                onClick={() => navigate(-1)}
                                className="hidden lg:flex items-center gap-2 -ml-4 text-muted-foreground hover:text-foreground"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Voltar
                            </Button>

                            {/* Category */}
                            <Badge variant="secondary" className="text-xs uppercase tracking-wider">
                                {product.type}
                            </Badge>

                            {/* Name */}
                            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-5 h-5 ${star <= 4
                                                ? "fill-amber-400 text-amber-400"
                                                : "text-muted-foreground"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    (4.0) • 127 avaliações
                                </span>
                            </div>

                            {/* Price */}
                            <div className="space-y-1">
                                <span className="text-4xl lg:text-5xl font-bold text-primary">
                                    R$ {product.price.toFixed(2).replace(".", ",")}
                                </span>
                                <p className="text-sm text-muted-foreground">
                                    ou 3x de R$ {(product.price / 3).toFixed(2).replace(".", ",")} sem juros
                                </p>
                            </div>

                            {/* Description */}
                            {product.description && (
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-foreground">Descrição</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>
                            )}

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-4">
                                <span className="font-medium">Quantidade:</span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={decrementQuantity}
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                    <span className="w-12 text-center font-semibold text-lg">
                                        {quantity}
                                    </span>
                                    <Button variant="outline" size="icon" onClick={incrementQuantity}>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3">
                                {/* Buy Now Button */}
                                <Button
                                    size="lg"
                                    className="w-full gap-2 text-lg py-6 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-lg"
                                    onClick={handleBuyNow}
                                    disabled={!product.in_stock}
                                >
                                    {product.in_stock ? (
                                        <>
                                            <Zap className="w-5 h-5" />
                                            Comprar Agora
                                        </>
                                    ) : (
                                        <>
                                            <AlertTriangle className="w-5 h-5" />
                                            Produto Indisponível
                                        </>
                                    )}
                                </Button>

                                {/* Add to Cart and View Cart */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="flex-1 gap-2 py-6"
                                        onClick={handleAddToCart}
                                        disabled={!product.in_stock}
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        Adicionar ao Carrinho
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="lg"
                                        className="gap-2"
                                        onClick={() => navigate("/carrinho")}
                                    >
                                        Ver Carrinho
                                    </Button>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                                <Card className="border-dashed">
                                    <CardContent className="flex items-center gap-3 p-4">
                                        <Truck className="w-8 h-8 text-primary" />
                                        <div>
                                            <p className="font-medium text-sm">Entrega Rápida</p>
                                            <p className="text-xs text-muted-foreground">Em até 40 min</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-dashed">
                                    <CardContent className="flex items-center gap-3 p-4">
                                        <Clock className="w-8 h-8 text-primary" />
                                        <div>
                                            <p className="font-medium text-sm">Sempre Gelado</p>
                                            <p className="text-xs text-muted-foreground">Temperatura ideal</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-dashed">
                                    <CardContent className="flex items-center gap-3 p-4">
                                        <Shield className="w-8 h-8 text-primary" />
                                        <div>
                                            <p className="font-medium text-sm">Compra Segura</p>
                                            <p className="text-xs text-muted-foreground">Pagamento protegido</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="container mx-auto px-4 py-12 border-t">
                        <h2 className="text-2xl font-bold mb-6">Produtos Relacionados</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard
                                    key={relatedProduct.id}
                                    id={relatedProduct.id}
                                    name={relatedProduct.name}
                                    type={relatedProduct.type}
                                    price={relatedProduct.price}
                                    imageUrl={relatedProduct.image_url || undefined}
                                    inStock={relatedProduct.in_stock}
                                    onAddToCart={() => {
                                        addItem({
                                            id: relatedProduct.id,
                                            name: relatedProduct.name,
                                            type: relatedProduct.type,
                                            price: relatedProduct.price,
                                            imageUrl: relatedProduct.image_url || undefined,
                                        });
                                        toast.success(`${relatedProduct.name} adicionado ao carrinho!`);
                                    }}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default ProductDetails;
