import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductCategories } from "@/components/ProductCategories";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { MobileNav } from "@/components/MobileNav";
import { Flame, Gift, ArrowRight, Beer, Wine, Martini } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-external";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  in_stock: boolean;
  image_url?: string;
}

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("in_stock", true)
      .limit(4)
      .order("created_at", { ascending: false });

    if (data) {
      setFeaturedProducts(data);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      type: product.type,
      price: product.price,
    });
    toast({
      title: "Produto adicionado! 🍺",
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pb-20 md:pb-0">
        <Hero />

        <ProductCategories />

        {/* Mais Vendidos Section */}
        {featuredProducts.length > 0 && (
          <section className="py-16 bg-background">
            <div className="container">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-accent" />
                    <Badge variant="secondary" className="bg-accent/10 text-accent">
                      Em alta
                    </Badge>
                  </div>
                  <h2 className="text-3xl font-bold">Mais Vendidos</h2>
                </div>
                <Button asChild variant="ghost" className="gap-2">
                  <Link to="/catalogo">
                    Ver todos
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {featuredProducts.map((product) => (
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
            </div>
          </section>
        )}

        {/* Promoções Section */}
        <section className="py-16 bg-gradient-promo">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Promo Card 1 */}
              <Card className="overflow-hidden border-0 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                <CardContent className="p-8 flex flex-col justify-between min-h-[200px]">
                  <div className="space-y-2">
                    <Badge className="bg-white/20 text-white hover:bg-white/30">
                      <Gift className="w-3 h-3 mr-1" />
                      Oferta Especial
                    </Badge>
                    <h3 className="text-2xl font-bold">Compre 6, Leve 8</h3>
                    <p className="text-white/90">Em cervejas selecionadas</p>
                  </div>
                  <Button asChild variant="secondary" className="w-fit mt-4">
                    <Link to="/catalogo?categoria=cervejas">Ver cervejas</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Promo Card 2 */}
              <Card className="overflow-hidden border-0 bg-gradient-to-br from-rose-600 to-purple-700 text-white">
                <CardContent className="p-8 flex flex-col justify-between min-h-[200px]">
                  <div className="space-y-2">
                    <Badge className="bg-white/20 text-white hover:bg-white/30">
                      🍷 Vinhos
                    </Badge>
                    <h3 className="text-2xl font-bold">20% OFF em Vinhos</h3>
                    <p className="text-white/90">Tintos, brancos e rosés</p>
                  </div>
                  <Button asChild variant="secondary" className="w-fit mt-4">
                    <Link to="/catalogo?categoria=vinhos">Ver vinhos</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5" />
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground tracking-tight">
                Pronto para pedir?
              </h2>
              <p className="text-xl text-primary-foreground/90 leading-relaxed">
                Monte seu carrinho e receba em casa em poucos minutos!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90 shadow-lg">
                  <Link to="/catalogo">Ver Catálogo Completo</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-background/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground hover:bg-background/20">
                  <Link to="/contato">Falar no WhatsApp</Link>
                </Button>
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

export default Index;
