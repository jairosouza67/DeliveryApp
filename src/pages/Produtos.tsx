import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-external";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { MobileNav } from "@/components/MobileNav";

interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  in_stock: boolean;
}

const categories = ["Todos", "Pó ABC", "Pó BC", "CO₂", "Água Pressurizada"];

const Produtos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [products, setProducts] = useState<Product[]>([]);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
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
      return;
    }

    setProducts(data || []);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || product.type === selectedCategory;
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
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pb-20 md:pb-0">
        {/* Page Header */}
        <section className="bg-gradient-hero py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground">
                Nossos Produtos
              </h1>
              <p className="text-xl text-primary-foreground/90">
                Equipamentos certificados e homologados para sua segurança
              </p>
            </div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="py-8 border-b bg-background sticky top-16 z-40">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filters and Cart */}
              <div className="flex flex-wrap gap-2 items-center">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
                <CartDrawer />
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  type={product.type}
                  price={product.price}
                  inStock={product.in_stock}
                  onAddToQuote={() => handleAddToCart(product)}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">
                  Nenhum produto encontrado.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default Produtos;
