import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Truck, Clock, Percent, Star, Zap } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden bg-background">
      {/* Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-background"></div>

      {/* Elegant amber light elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />

      <div className="container relative z-10 py-24">
        <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
          <div className="text-center space-y-6">
            {/* Promo Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-accent/15 border border-accent/30 shadow-glow promo-badge">
              <Percent className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-accent">Primeira compra com 10% OFF</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-foreground leading-tight tracking-tight">
              Bebida gelada
              <span className="block mt-2 bg-gradient-hero bg-clip-text text-transparent leading-tight">
                na sua porta
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Peça sua bebida favorita e receba em casa de forma rápida e prática.
              Cervejas, vinhos, destilados e muito mais!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <Button asChild size="lg" className="w-full sm:w-auto shadow-elegant shadow-primary/30 text-lg px-8 py-6">
              <Link to="/catalogo">
                <Zap className="mr-2 h-5 w-5" />
                Ver Catálogo
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-primary/30 hover:bg-primary/5 text-lg px-8 py-6">
              <Link to="/contato">Fale Conosco</Link>
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            <div className="flex flex-col items-center gap-4 p-8 rounded-xl bg-card border border-primary/10 hover:border-primary/30 hover:shadow-elegant transition-all animate-scale-in group">
              <div className="p-4 rounded-full bg-primary/15 group-hover:bg-primary/25 transition-colors shadow-sm">
                <Truck className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-lg">Entrega Rápida</h3>
              <p className="text-sm text-muted-foreground text-center">
                Receba em até 40 minutos na sua região
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 p-8 rounded-xl bg-card border border-primary/10 hover:border-primary/30 hover:shadow-elegant transition-all animate-scale-in delay-100 group">
              <div className="p-4 rounded-full bg-primary/15 group-hover:bg-primary/25 transition-colors shadow-sm">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-lg">Pedido Fácil</h3>
              <p className="text-sm text-muted-foreground text-center">
                Monte seu carrinho em poucos cliques
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 p-8 rounded-xl bg-card border border-primary/10 hover:border-primary/30 hover:shadow-elegant transition-all animate-scale-in delay-200 group">
              <div className="p-4 rounded-full bg-primary/15 group-hover:bg-primary/25 transition-colors shadow-sm">
                <Star className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-lg">Qualidade Garantida</h3>
              <p className="text-sm text-muted-foreground text-center">
                Bebidas sempre geladas e de marcas premium
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
