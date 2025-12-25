import { Link } from "react-router-dom";
import { Beer, MapPin, Clock, Phone, MessageCircle, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary">
                <Beer className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-primary">BebeMais</span>
            </Link>
            <p className="text-secondary-foreground/80 text-sm">
              Delivery de bebidas rápido e prático. Entregamos na sua porta com agilidade e qualidade.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="hover:bg-primary/20">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary/20">
                <Facebook className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navegação */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Navegação</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                Início
              </Link>
              <Link to="/catalogo" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                Catálogo
              </Link>
              <Link to="/carrinho" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                Carrinho
              </Link>
              <Link to="/contato" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                Contato
              </Link>
            </nav>
          </div>

          {/* Horário e Entrega */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Horário de Funcionamento</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm text-secondary-foreground/80">
                  <p className="font-medium">Segunda a Sábado</p>
                  <p>10:00 às 22:00</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm text-secondary-foreground/80">
                  <p className="font-medium">Domingo e Feriados</p>
                  <p>12:00 às 20:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contato</h4>
            <div className="space-y-3">
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
              >
                <MessageCircle className="h-5 w-5 text-green-500" />
                <span>WhatsApp: (11) 99999-9999</span>
              </a>
              <a
                href="tel:+5511999999999"
                className="flex items-center gap-3 text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
              >
                <Phone className="h-5 w-5 text-primary" />
                <span>(11) 99999-9999</span>
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm text-secondary-foreground/80">
                  <p>Área de entrega:</p>
                  <p>Centro, Zona Sul, Zona Oeste</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-foreground/10">
        <div className="container py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-secondary-foreground/60">
            © {currentYear} BebeMais. Todos os direitos reservados.
          </p>
          <p className="text-xs text-secondary-foreground/50">
            🍺 Bebida alcoólica: venda proibida para menores de 18 anos.
          </p>
        </div>
      </div>
    </footer>
  );
};
