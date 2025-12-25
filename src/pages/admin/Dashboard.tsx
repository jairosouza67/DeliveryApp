import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase-external";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
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

  const sidebarItems = [
    { icon: ShoppingCart, label: "Pedidos", path: "/admin/pedidos" },
    { icon: Package, label: "Produtos", path: "/admin/products" },
    { icon: Users, label: "Clientes", path: "/admin/customers" },
    { icon: Truck, label: "Fornecedores", path: "/admin/suppliers" },
  ];

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r bg-muted/30 flex-shrink-0">
          <div className="p-6 border-b">
            <h2 className="font-semibold text-lg">Painel Admin</h2>
            <p className="text-sm text-muted-foreground">Gestão BebeMais</p>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-3">
              Ações Rápidas
            </p>
            {sidebarItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className="w-full justify-start gap-3 h-11"
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </nav>
          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={() => navigate("/")}
            >
              <Package className="h-4 w-4" />
              Voltar à Loja
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Dashboard BebeMais</h1>
            <p className="text-muted-foreground">Gestão do delivery de bebidas</p>
          </div>

          {/* Mobile Quick Actions */}
          <div className="md:hidden mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {sidebarItems.map((item) => (
                <Button
                  key={item.path}
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0 gap-2"
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas (Total)</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{formatCurrency(stats.todaySales)}</div>
                <p className="text-xs text-muted-foreground">Pedidos aprovados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.orders}</div>
                <p className="text-xs text-muted-foreground">Total de pedidos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.products}</div>
                <p className="text-xs text-muted-foreground">No catálogo</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.customers}</div>
                <p className="text-xs text-muted-foreground">Cadastrados</p>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Orders by Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Pedidos por Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ordersByStatus.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={ordersByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ status, percentage }) => `${status}: ${percentage.toFixed(0)}%`}
                        outerRadius={80}
                        fill="hsl(var(--primary))"
                        dataKey="count"
                      >
                        {ordersByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                    Nenhum pedido ainda
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Low Stock Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Produtos Fora de Estoque
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[250px] overflow-y-auto">
                  {lowStockProducts.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">
                      ✅ Todos os produtos estão em estoque
                    </p>
                  ) : (
                    lowStockProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="font-medium">{product.name}</span>
                        <Badge variant="destructive">Sem estoque</Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pedidos Recentes</CardTitle>
              <Button variant="outline" onClick={() => navigate("/admin/pedidos")}>
                Ver Todos
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhum pedido recente
                  </p>
                ) : (
                  recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div className="flex-1">
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <p className="font-semibold">{formatCurrency(order.total_value || 0)}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
