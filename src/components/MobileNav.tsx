import { Link, useLocation } from "react-router-dom";
import { Home, Grid3X3, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export const MobileNav = () => {
    const location = useLocation();
    const { itemCount } = useCart();

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { path: "/", icon: Home, label: "Início" },
        { path: "/catalogo", icon: Grid3X3, label: "Catálogo" },
        { path: "/carrinho", icon: ShoppingCart, label: "Carrinho", badge: itemCount },
        { path: "/login", icon: User, label: "Conta" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur border-t shadow-lg">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors relative ${isActive(item.path)
                                ? "text-primary"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <div className="relative">
                            <item.icon className="w-5 h-5" />
                            {item.badge && item.badge > 0 && (
                                <span className="absolute -top-2 -right-2 w-4 h-4 text-[10px] font-bold bg-accent text-accent-foreground rounded-full flex items-center justify-center">
                                    {item.badge > 9 ? "9+" : item.badge}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </Link>
                ))}
            </div>
        </nav>
    );
};
