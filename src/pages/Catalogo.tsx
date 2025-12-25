import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-external";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { MobileNav } from "@/components/MobileNav";
import { useSearchParams } from "react-router-dom";

interface Product {
    id: string;
    name: string;
    type: string;
    price: number;
    in_stock: boolean;
    image_url?: string;
    description?: string;
}

const categories = [
    { id: "todos", label: "Todos" },
    { id: "cervejas", label: "🍺 Cervejas" },
    { id: "vinhos", label: "🍷 Vinhos" },
    { id: "destilados", label: "🥃 Destilados" },
    { id: "drinks", label: "🍹 Drinks" },
    { id: "refrigerantes", label: "🥤 Refrigerantes" },
    { id: "combos", label: "📦 Combos" },
];

const Catalogo = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(
        searchParams.get("categoria") || "todos"
    );
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addItem } = useCart();
    const { toast } = useToast();

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const categoria = searchParams.get("categoria");
        if (categoria) {
            setSelectedCategory(categoria);
        }
    }, [searchParams]);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .order("name");

        if (error) {
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Não foi possível carregar os produtos.",
            });
            setLoading(false);
            return;
        }

        setProducts(data || []);
        setLoading(false);
    };

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId);
        if (categoryId === "todos") {
            searchParams.delete("categoria");
        } else {
            searchParams.set("categoria", categoryId);
        }
        setSearchParams(searchParams);
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "todos" ||
            product.type.toLowerCase().includes(selectedCategory.toLowerCase());
        return matchesSearch && matchesCategory;
    });

    const handleAddToCart = (product: Product) => {
        addItem({
            id: product.id,
            name: product.name,
            type: product.type,
            price: product.price,
        });
        toast({
            title: "Adicionado ao carrinho! 🛒",
            description: `${product.name} - R$ ${product.price.toFixed(2).replace('.', ',')}`,
        });
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 pb-20 md:pb-0">
                {/* Page Header */}
                <section className="bg-gradient-hero py-16">
                    <div className="container">
                        <div className="max-w-3xl mx-auto text-center space-y-4 animate-fade-in">
                            <Badge className="bg-white/20 text-white">
                                Catálogo Completo
                            </Badge>
                            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground">
                                Nossas Bebidas
                            </h1>
                            <p className="text-xl text-primary-foreground/90">
                                Escolha suas bebidas favoritas e receba em casa geladas!
                            </p>
                        </div>
                    </div>
                </section>

                {/* Filters and Search */}
                <section className="py-6 border-b bg-background sticky top-16 z-40">
                    <div className="container">
                        <div className="flex flex-col gap-4">
                            {/* Search */}
                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <Input
                                        placeholder="Buscar bebidas..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <CartDrawer />
                            </div>

                            {/* Category Filters */}
                            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
                                {categories.map((category) => (
                                    <Button
                                        key={category.id}
                                        variant={selectedCategory === category.id ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleCategoryChange(category.id)}
                                        className="whitespace-nowrap flex-shrink-0"
                                    >
                                        {category.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Products Grid */}
                <section className="py-8">
                    <div className="container">
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="aspect-[3/4] bg-muted rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <p className="text-sm text-muted-foreground">
                                        {filteredProducts.length} produto(s) encontrado(s)
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                    {filteredProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            id={product.id}
                                            name={product.name}
                                            type={product.type}
                                            price={product.price}
                                            imageUrl={product.image_url}
                                            inStock={product.in_stock}
                                            onAddToCart={() => handleAddToCart(product)}
                                        />
                                    ))}
                                </div>

                                {filteredProducts.length === 0 && (
                                    <div className="text-center py-20">
                                        <p className="text-xl text-muted-foreground mb-4">
                                            Nenhum produto encontrado.
                                        </p>
                                        <Button variant="outline" onClick={() => {
                                            setSearchTerm("");
                                            handleCategoryChange("todos");
                                        }}>
                                            Limpar filtros
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
            <MobileNav />
        </div>
    );
};

export default Catalogo;
