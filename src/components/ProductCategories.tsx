import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Beer, Wine, Martini, Coffee, Droplets, Package } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    icon: Beer,
    title: "Cervejas",
    description: "Pilsen, IPA, Lager, artesanais e importadas",
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    link: "/catalogo?categoria=cervejas",
  },
  {
    icon: Wine,
    title: "Vinhos",
    description: "Tintos, brancos, rosés e espumantes",
    color: "text-rose-600",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
    link: "/catalogo?categoria=vinhos",
  },
  {
    icon: Martini,
    title: "Destilados",
    description: "Whisky, vodka, gin, rum e cachaça",
    color: "text-sky-500",
    bgColor: "bg-sky-50 dark:bg-sky-950/30",
    link: "/catalogo?categoria=destilados",
  },
  {
    icon: Coffee,
    title: "Drinks & Energéticos",
    description: "Bebidas prontas, energéticos e mixers",
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    link: "/catalogo?categoria=drinks",
  },
  {
    icon: Droplets,
    title: "Refrigerantes & Sucos",
    description: "Coca-Cola, Guaraná, sucos naturais",
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    link: "/catalogo?categoria=refrigerantes",
  },
  {
    icon: Package,
    title: "Combos & Promoções",
    description: "Kits especiais com desconto",
    color: "text-primary",
    bgColor: "bg-primary/10",
    link: "/catalogo?categoria=combos",
  },
];

export const ProductCategories = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Explore nossas{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Categorias
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Das cervejas geladas aos destilados premium, temos a bebida perfeita para você
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link to={category.link} key={category.title}>
              <Card
                className="group hover:shadow-elegant transition-all duration-300 cursor-pointer animate-fade-in h-full"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className={`w-14 h-14 rounded-xl ${category.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <category.icon className={`w-7 h-7 ${category.color}`} />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {category.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
