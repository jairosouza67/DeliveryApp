import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, Beer, Clock, MapPin, Lock } from "lucide-react";
import { useState } from "react";
import { CartDrawer } from "./CartDrawer";
import { useCart } from "@/contexts/CartContext";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { itemCount } = useCart();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Início" },
    { path: "/catalogo", label: "Catálogo" },
    { path: "/contato", label: "Contato" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-gradient-hero group-hover:scale-105 transition-transform">
            <Beer className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              BebeMais
            </span>
            <span className="text-[10px] text-muted-foreground -mt-1 hidden sm:block">
              Delivery de Bebidas
            </span>
          </div>
        </Link>

        {/* Horário Badge - Desktop */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium">Horário: 10h às 22h</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive(link.path)
                ? "text-primary"
                : "text-muted-foreground"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <CartDrawer />

          {/* Área Restrita Button - Desktop */}
          <Link to="/login" className="hidden md:block">
            <Button variant="outline" size="sm" className="gap-2">
              <Lock className="h-3.5 w-3.5" />
              Área Restrita
            </Button>
          </Link>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background animate-fade-in">
          <nav className="container py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(link.path)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
                  }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Área Restrita Button - Mobile */}
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              <Lock className="h-4 w-4" />
              Área Restrita
            </Link>

            <div className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Horário: 10h às 22h</span>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
