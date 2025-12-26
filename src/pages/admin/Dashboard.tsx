import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase-external";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Package,
  DollarSign,
  Users,
  AlertTriangle,
  TrendingUp,
  Clock,
  Truck,
  CheckCircle,
  XCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    orders: 0,
    todaySales: 0,
  });

  const [ordersByStatus, setOrdersByStatus] = useState<{ status: string; count: number; percentage: number }[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<{ name: string; in_stock: boolean }[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchOrdersByStatus();
    fetchLowStockProducts();
    fetchRecentOrders();

    // Setup realtime subscriptions
    const ordersChannel = supabase
      .channel('quotes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quotes' }, () => {
        fetchStats();
        fetchOrdersByStatus();
        fetchRecentOrders();
      })
      .subscribe();

    const productsChannel = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchStats();
        fetchLowStockProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(productsChannel);
    };
  }, []);

  const fetchStats = async () => {
    const [customersCount, productsCount, ordersCount] = await Promise.all([
      supabase.from("customers").select("*", { count: "exact", head: true }),
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("quotes").select("*", { count: "exact", head: true }),
    ]);

    // Calculate today's sales (simplified - would need proper date filtering)
    const { data: todayOrders } = await supabase
      .from("quotes")
      .select("total_value")
      .eq("status", "approved");

    const todaySales = todayOrders?.reduce((sum, order) => sum + (order.total_value || 0), 0) || 0;

    setStats({
      customers: customersCount.count || 0,
      products: productsCount.count || 0,
      orders: ordersCount.count || 0,
      todaySales,
    });
  };

  const fetchOrdersByStatus = async () => {
    const { data: orders } = await supabase.from("quotes").select("status");

    if (orders) {
      const statusCounts = orders.reduce((acc: any, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});

      const statusLabels: Record<string, string> = {
        'pending': 'Recebido',
        'approved': 'Aprovado',
        'cancelled': 'Cancelado',
        'processing': 'Separando',
        'delivered': 'Entregue',
      };

      const total = orders.length;
      const statusData = Object.entries(statusCounts).map(([status, count]) => ({
        status: statusLabels[status] || status,
        count: count as number,
        percentage: ((count as number) / total) * 100,
      }));

      setOrdersByStatus(statusData);
    }
  };

  const fetchLowStockProducts = async () => {
    const { data: products } = await supabase
      .from("products")
      .select("name, in_stock")
      .eq("in_stock", false)
      .order("name", { ascending: true })
      .limit(10);

    if (products) {
      setLowStockProducts(products);
    }
  };

  const fetchRecentOrders = async () => {
    const { data: orders } = await supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (orders) {
      setRecentOrders(orders);
    }
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
      pending: { variant: "secondary", icon: <Clock className="w-3 h-3" /> },
      processing: { variant: "default", icon: <Package className="w-3 h-3" /> },
      approved: { variant: "default", icon: <Truck className="w-3 h-3" /> },
      delivered: { variant: "outline", icon: <CheckCircle className="w-3 h-3" /> },
      cancelled: { variant: "destructive", icon: <XCircle className="w-3 h-3" /> },
    };
    const config = variants[status] || variants.pending;
    return (
      <Badge variant={config.variant} className="gap-1">
        {config.icon}
        {status === 'pending' ? 'Recebido' :
          status === 'processing' ? 'Separando' :
            status === 'approved' ? 'Aprovado' :
              status === 'delivered' ? 'Entregue' :
                status === 'cancelled' ? 'Cancelado' : status}
      </Badge>
    );
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const renderCustomLabel = (props: any) => {
    const { status, percentage } = props;
    return `${status}: ${percentage.toFixed(0)}%`;
  };

  return (
    <AdminLayout title="Resumo Geral" subtitle="Bem-vindo de volta! Aqui está uma visão rápida do seu negócio hoje.">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <Card className="glass-card border-none relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 card-hover-effect">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="w-24 h-24 -mr-8 -mt-8" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Vendas Totais</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black text-primary tracking-tight mb-1">{formatCurrency(stats.todaySales)}</div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">
              <TrendingUp className="h-3 w-3" />
              +12% desde ontem
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 card-hover-effect">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShoppingCart className="w-24 h-24 -mr-8 -mt-8" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Pedidos</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black tracking-tight mb-1">{stats.orders}</div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Total acumulado</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-none relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 card-hover-effect">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Package className="w-24 h-24 -mr-8 -mt-8" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Produtos</CardTitle>
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Package className="h-5 w-5 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black tracking-tight mb-1">{stats.products}</div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Itens ativos</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-none relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 card-hover-effect">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-24 h-24 -mr-8 -mt-8" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Clientes</CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Users className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black tracking-tight mb-1">{stats.customers}</div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Base fiel</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Orders by Status */}
        <Card className="glass-card border-none lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-black tracking-tight">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              Status das Vendas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ordersByStatus.length > 0 ? (
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ordersByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="count"
                    >
                      {ordersByStatus.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="transparent"
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '16px',
                        border: 'none',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      formatter={(value) => <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground font-medium">
                Nenhum pedido registrado hoje
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Products */}
        <Card className="glass-card border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-black tracking-tight">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              </div>
              Atenção Estoque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              {lowStockProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
                  <CheckCircle className="h-12 w-12 text-emerald-500 mb-4" />
                  <p className="text-sm font-bold uppercase tracking-widest">Estoque Completo</p>
                </div>
              ) : (
                lowStockProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                        <Package className="h-5 w-5 text-orange-500" />
                      </div>
                      <span className="font-bold text-sm tracking-tight">{product.name}</span>
                    </div>
                    <Badge variant="destructive" className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest">Esgotado</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="glass-card border-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
        <CardHeader className="flex flex-row items-center justify-between shrink-0 relative z-10">
          <CardTitle className="text-2xl font-black tracking-tight">Atividade Recente</CardTitle>
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/pedidos")}
            className="font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-primary/10 hover:text-primary transition-all"
          >
            Ver Relatório Completo
          </Button>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                <ShoppingCart className="h-16 w-16 mb-4" />
                <p className="font-bold uppercase tracking-widest">Aguardando primeiros pedidos</p>
              </div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all duration-300 group">
                  <div className="flex items-center gap-5 flex-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-white/10 to-transparent rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                      <Users className="h-7 w-7 text-white/30" />
                    </div>
                    <div>
                      <p className="font-black text-lg tracking-tight leading-tight">{order.customer_name}</p>
                      <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - {new Date(order.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-8">
                    <div className="hidden md:block">
                      <p className="font-black text-2xl tracking-tighter text-primary">{formatCurrency(order.total_value || 0)}</p>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Valor do Pedido</p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default Dashboard;
