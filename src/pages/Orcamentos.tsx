import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Send, Download, Plus, Trash2, FileDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateQuotePDF } from "@/lib/generateQuotePDF";
import { MobileNav } from "@/components/MobileNav";

interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  in_stock: boolean;
}

interface ManualItem {
  id: string;
  product_id: string;
  product_name: string;
  product_type: string;
  quantity: number;
  unit_price: number;
}

const Orcamentos = () => {
  const { toast } = useToast();
  const { items, clearCart, total } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [manualItems, setManualItems] = useState<ManualItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [lastCreatedQuote, setLastCreatedQuote] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    observations: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("in_stock", true)
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

  const addManualItem = () => {
    if (!selectedProductId) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Selecione um produto.",
      });
      return;
    }

    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    const existingItem = manualItems.find((item) => item.product_id === selectedProductId);

    if (existingItem) {
      setManualItems(
        manualItems.map((item) =>
          item.product_id === selectedProductId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setManualItems([
        ...manualItems,
        {
          id: crypto.randomUUID(),
          product_id: product.id,
          product_name: product.name,
          product_type: product.type,
          quantity,
          unit_price: product.price,
        },
      ]);
    }

    setSelectedProductId("");
    setQuantity(1);

    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado à lista.`,
    });
  };

  const removeManualItem = (id: string) => {
    setManualItems(manualItems.filter((item) => item.id !== id));
  };

  const updateManualItemQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeManualItem(id);
      return;
    }
    setManualItems(
      manualItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const manualTotal = manualItems.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  // Se tiver itens no carrinho, usa o carrinho; se não, usa os manuais
  const finalItems = items.length > 0 ? items : manualItems;
  const finalTotal = items.length > 0 ? total : manualTotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (finalItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Sem produtos",
        description: "Adicione produtos antes de solicitar o orçamento.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Do not include prices inside the saved items (values are treated as 'a combinar')
      const quoteItems = finalItems.map((item: any) => ({
        product_id: item.id || item.product_id,
        product_name: item.name || item.product_name,
        product_type: item.type || item.product_type,
        quantity: item.quantity,
      }));

      // Attach creator when user is authenticated so sellers can see their own quotes
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const creatorId = user?.id ?? null;

      const { data, error } = await supabase
        .from("quotes")
        .insert([
          {
            // Qualquer pessoa pode preencher esses dados; não depende de auth
            customer_name: formData.name,
            customer_email: formData.email || null,
            customer_phone: formData.phone,
            items: quoteItems,
            // Valor é tratado como "a combinar" no admin; guardamos o somatório apenas como referência interna
            total_value: finalTotal || 0,
            status: "pending",
            notes: `Endereço: ${formData.address}\nContato: ${formData.contact}\nObservações: ${formData.observations}`,
            created_by: creatorId,
          },
        ])
        .select();

      if (error) throw error;

      setLastCreatedQuote(data?.[0]);

      toast({
        title: "Sucesso!",
        description: "Seu orçamento foi enviado. Nosso time entrará em contato em breve.",
      });

      // Limpa carrinho local e itens manuais
      clearCart();
      setManualItems([]);
      setFormData({
        name: "",
        contact: "",
        email: "",
        phone: "",
        address: "",
        observations: "",
      });
    } catch (error) {
      console.error("Error submitting quote:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível enviar o orçamento. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pb-20 md:pb-0">
        <section className="bg-gradient-hero py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground">
                Solicitar Orçamento
              </h1>
              <p className="text-xl text-primary-foreground/90">
                Qualquer pessoa pode solicitar um orçamento. Nosso time recebe tudo diretamente no painel administrativo.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container max-w-4xl">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-2xl">Dados do Cliente</CardTitle>
                <CardDescription>
                  Preencha seus dados e os produtos desejados. Seu pedido será encaminhado ao time interno.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Seleção de produtos manuais quando não há itens no carrinho */}
                {items.length === 0 && (
                  <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                    <h3 className="font-semibold mb-3">Adicionar Produtos</h3>
                    <div className="flex gap-2 mb-4">
                      <Select
                        value={selectedProductId}
                        onValueChange={setSelectedProductId}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Selecione um produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(parseInt(e.target.value) || 1)
                        }
                        className="w-20"
                        placeholder="Qtd"
                      />
                      <Button type="button" onClick={addManualItem} size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {manualItems.length > 0 && (
                      <div className="space-y-2">
                        {manualItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center text-sm p-2 bg-background rounded"
                          >
                            <div className="flex-1">
                              <p className="font-medium">
                                {item.product_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.product_type}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateManualItemQuantity(
                                    item.id,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className="w-16 h-8"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => removeManualItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Resumo do carrinho se tiver itens */}
                {items.length > 0 && (
                  <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                    <h3 className="font-semibold mb-3">Produtos do Carrinho</h3>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center text-sm"
                        >
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Atenção:</strong> Valores finais serão definidos
                        pelo time comercial. Você receberá o retorno por
                        telefone ou WhatsApp.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome / Razão Social *</Label>
                      <Input
                        id="name"
                        placeholder="Digite o nome ou razão social"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Pessoa de Contato</Label>
                      <Input
                        id="contact"
                        placeholder="Nome do responsável"
                        value={formData.contact}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Telefone / WhatsApp *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(11) 99999-9999"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço Completo</Label>
                    <Input
                      id="address"
                      placeholder="Rua, número, complemento, bairro, cidade - UF"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observations">Observações</Label>
                    <Textarea
                      id="observations"
                      placeholder="Informações adicionais, prazo desejado, forma de pagamento preferida, etc."
                      className="min-h-[100px]"
                      value={formData.observations}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          observations: e.target.value,
                        })
                      }
                    />
                  </div>

                  {lastCreatedQuote && (
                    <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg mb-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-green-800 dark:text-green-200">
                            Orçamento criado com sucesso!
                          </h3>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Sua solicitação foi enviada para o time interno e
                            também está disponível no painel administrativo.
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={async () =>
                            await generateQuotePDF(lastCreatedQuote)
                          }
                          className="border-green-600 text-green-700 hover:bg-green-100 dark:border-green-400 dark:text-green-300 dark:hover:bg-green-900"
                        >
                          <FileDown className="mr-2 h-4 w-4" />
                          Baixar PDF
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {isSubmitting
                        ? "Enviando..."
                        : "Enviar Solicitação de Orçamento"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card className="text-center">
                <CardHeader>
                  <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Acesso Livre</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Qualquer visitante pode solicitar orçamento sem criar conta.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Download className="w-8 h-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Centralizado no Admin</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Todos os orçamentos vão direto para o painel da equipe interna.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Send className="w-8 h-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Sem Compromisso</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Orçamento gratuito e sem obrigação de contratação.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default Orcamentos;
