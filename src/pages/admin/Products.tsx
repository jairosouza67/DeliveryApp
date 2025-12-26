import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-external";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Package, Clock } from "lucide-react";

interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  in_stock: boolean;
  description: string | null;
  created_at: string;
}

const Products = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: 0,
    in_stock: true,
    description: "",
  });

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
    } else {
      setProducts(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(formData)
        .eq("id", editingProduct.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível atualizar o produto.",
        });
      } else {
        toast({
          title: "Sucesso",
          description: "Produto atualizado com sucesso.",
        });
        fetchProducts();
        closeDialog();
      }
    } else {
      const { error } = await supabase.from("products").insert([formData]);

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível adicionar o produto.",
        });
      } else {
        toast({
          title: "Sucesso",
          description: "Produto adicionado com sucesso.",
        });
        fetchProducts();
        closeDialog();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir o produto.",
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso.",
      });
      fetchProducts();
    }
  };

  const openDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        type: product.type,
        price: product.price,
        in_stock: product.in_stock,
        description: product.description || "",
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        type: "",
        price: 0,
        in_stock: true,
        description: "",
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  return (
    <AdminLayout title="Catálogo" subtitle="Gerencie seus produtos com agilidade e estilo.">
      <div className="mb-8 flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()} className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/30 hover:scale-105 transition-transform">
              <Plus className="mr-3 h-6 w-6" />
              Adicionar Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-none backdrop-blur-3xl sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black tracking-tight">
                {editingProduct ? "Ajustar Produto" : "Criar Produto"}
              </DialogTitle>
              <DialogDescription className="font-medium">
                Insira as informações básicas para atualizar o catálogo.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 pt-4 text-left">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-primary">Nome do Produto</Label>
                <Input
                  id="name"
                  placeholder="Ex: Heineken 600ml"
                  required
                  className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary font-bold"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-xs font-black uppercase tracking-widest text-primary">Categoria</Label>
                  <Input
                    id="type"
                    placeholder="Cervejas"
                    required
                    className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary font-bold"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-xs font-black uppercase tracking-widest text-primary">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    required
                    className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary font-bold"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-primary">Observações</Label>
                <Input
                  id="description"
                  placeholder="Detalhes adicionais..."
                  className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary font-bold"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex flex-col">
                  <Label htmlFor="in_stock" className="font-bold text-sm">Disponível para venda</Label>
                  <span className="text-[10px] text-muted-foreground uppercase font-black">Status de estoque</span>
                </div>
                <Switch
                  id="in_stock"
                  checked={formData.in_stock}
                  onCheckedChange={(checked) => setFormData({ ...formData, in_stock: checked })}
                />
              </div>
              <div className="flex gap-3 pt-6">
                <Button type="submit" className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest">Confirmar</Button>
                <Button type="button" variant="ghost" onClick={closeDialog} className="h-12 rounded-xl font-bold uppercase tracking-widest bg-white/5">
                  Fechar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="glass-card border-none overflow-hidden relative">
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 blur-[60px] pointer-events-none" />
        <CardHeader className="relative z-10 p-8 border-b border-white/5">
          <CardTitle className="text-2xl font-black tracking-tight">Lista de Inventário</CardTitle>
        </CardHeader>
        <CardContent className="p-0 relative z-10">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="px-8 h-16 text-xs font-black uppercase tracking-widest text-primary">Produto</TableHead>
                  <TableHead className="h-16 text-xs font-black uppercase tracking-widest text-primary">Tipo</TableHead>
                  <TableHead className="h-16 text-xs font-black uppercase tracking-widest text-primary">Preço</TableHead>
                  <TableHead className="h-16 text-xs font-black uppercase tracking-widest text-primary">Estoque</TableHead>
                  <TableHead className="px-8 h-16 text-right text-xs font-black uppercase tracking-widest text-primary">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                    <TableCell className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform shadow-inner">
                          <Package className="h-6 w-6 text-white/40" />
                        </div>
                        <div>
                          <p className="font-black text-base tracking-tight">{product.name}</p>
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Ref: {product.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                        {product.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <p className="font-black text-lg tracking-tighter">R$ {product.price.toFixed(2)}</p>
                    </TableCell>
                    <TableCell>
                      {product.in_stock ? (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Pronto</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Esgotado</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="px-8 text-right">
                      <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 bg-white/5 rounded-xl hover:bg-primary/20 hover:text-primary"
                          onClick={() => openDialog(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 bg-white/5 rounded-xl hover:bg-destructive/20 hover:text-destructive text-destructive/60"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {products.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center opacity-30">
                        <Plus className="h-16 w-16 mb-4" />
                        <p className="font-black text-sm uppercase tracking-widest">Nenhum item encontrado</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default Products;
