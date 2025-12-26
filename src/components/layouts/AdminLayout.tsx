import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
    ShoppingCart,
    Package,
    Users,
    Truck,
    LayoutDashboard,
} from "lucide-react";

interface AdminLayoutProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
}

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: ShoppingCart, label: "Pedidos", path: "/admin/pedidos" },
    { icon: Package, label: "Produtos", path: "/admin/products" },
    { icon: Users, label: "Clientes", path: "/admin/customers" },
    { icon: Truck, label: "Fornecedores", path: "/admin/suppliers" },
];

export const AdminLayout = ({ children, title, subtitle }: AdminLayoutProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <div className="h-screen flex flex-col bg-background/50 relative overflow-hidden font-sans">
            {/* Background Decorative Blob */}
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />

            <Header />
            <div className="flex-1 flex overflow-hidden relative z-10">
                {/* Sidebar */}
                <aside className="hidden md:flex w-72 flex-col glass-sidebar m-4 mr-0 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500">
                    <div className="p-8 border-b border-white/5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <Package className="text-white h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="font-bold text-xl text-white tracking-tight">BebeMais</h2>
                                <p className="text-[10px] text-primary/80 uppercase font-black tracking-[0.2em]">Painel Admin</p>
                            </div>
                        </div>
                    </div>
                    <nav className="flex-1 p-6 space-y-3 overflow-y-auto custom-scrollbar">
                        <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4 px-3">
                            Navegação
                        </p>
                        {sidebarItems.map((item) => (
                            <Button
                                key={item.path}
                                variant="ghost"
                                className={`w-full justify-start gap-4 h-12 rounded-xl transition-all duration-300 group ${isActive(item.path)
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary"
                                        : "text-white/60 hover:text-white hover:bg-white/5"
                                    }`}
                                onClick={() => navigate(item.path)}
                            >
                                <item.icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${isActive(item.path) ? "scale-110" : ""
                                    }`} />
                                <span className="font-medium tracking-wide">{item.label}</span>
                                {isActive(item.path) && (
                                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]" />
                                )}
                            </Button>
                        ))}
                    </nav>
                    <div className="p-6 border-t border-white/5 bg-white/[0.02]">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-4 h-12 rounded-xl text-white/50 hover:text-white hover:bg-white/5"
                            onClick={() => navigate("/")}
                        >
                            <LayoutDashboard className="h-5 w-5" />
                            <span className="font-medium">Sair do Admin</span>
                        </Button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-10">
                    <div className="max-w-7xl mx-auto">
                        {/* Page Header */}
                        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
                            <h1 className="text-5xl font-black tracking-tighter mb-3 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">{title}</h1>
                            {subtitle && <p className="text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">{subtitle}</p>}
                        </div>

                        {/* Mobile Quick Actions */}
                        <div className="md:hidden mb-8">
                            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                                {sidebarItems.map((item) => (
                                    <Button
                                        key={item.path}
                                        variant={isActive(item.path) ? "default" : "outline"}
                                        size="lg"
                                        className={`flex-shrink-0 gap-2 rounded-2xl h-14 px-6 ${isActive(item.path) ? "shadow-lg shadow-primary/20" : "bg-white/5backdrop-blur-sm border-white/10"
                                            }`}
                                        onClick={() => navigate(item.path)}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span className="font-bold uppercase text-[10px] tracking-widest">{item.label}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Page Content */}
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
