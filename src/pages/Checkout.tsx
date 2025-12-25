import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/contexts/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
    ArrowLeft,
    ArrowRight,
    CreditCard,
    Smartphone,
    Banknote,
    MapPin,
    User,
    Phone,
    MessageCircle,
    CheckCircle2,
    Package
} from "lucide-react";
import { useState } from "react";

const Checkout = () => {
    const { items, total, itemCount, clearCart } = useCart();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState("pix");
    const [deliveryType, setDeliveryType] = useState("delivery");

    // Form fields
    const [formData, setFormData] = useState({
        nome: "",
        telefone: "",
        cep: "",
        endereco: "",
        numero: "",
        complemento: "",
        bairro: "",
        referencia: "",
    });

    const deliveryFee = deliveryType === "delivery" ? 5.00 : 0;
    const grandTotal = total + deliveryFee;

    const formatPrice = (value: number) => {
        return `R$ ${value.toFixed(2).replace('.', ',')}`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNextStep = () => {
        if (step === 1) {
            setStep(2);
        }
    };

    const handlePrevStep = () => {
        if (step === 2) {
            setStep(1);
        } else {
            navigate("/carrinho");
        }
    };

    const handleFinishOrder = () => {
        // Validate form
        if (deliveryType === "delivery") {
            if (!formData.nome || !formData.telefone || !formData.endereco || !formData.numero || !formData.bairro) {
                toast({
                    variant: "destructive",
                    title: "Dados incompletos",
                    description: "Preencha todos os campos obrigatórios.",
                });
                return;
            }
        } else {
            if (!formData.nome || !formData.telefone) {
                toast({
                    variant: "destructive",
                    title: "Dados incompletos",
                    description: "Preencha nome e telefone para retirada.",
                });
                return;
            }
        }

        // Create order message for WhatsApp
        const orderItems = items.map(item =>
            `• ${item.quantity}x ${item.name} - ${formatPrice(item.price * item.quantity)}`
        ).join('\n');

        const orderNotes = localStorage.getItem("orderNotes") || "";

        let message = `🍺 *Novo Pedido - BebeMais*\n\n`;
        message += `*Cliente:* ${formData.nome}\n`;
        message += `*Telefone:* ${formData.telefone}\n\n`;
        message += `*Itens do Pedido:*\n${orderItems}\n\n`;
        message += `*Subtotal:* ${formatPrice(total)}\n`;

        if (deliveryType === "delivery") {
            message += `*Entrega:* ${formatPrice(deliveryFee)}\n`;
            message += `*Total:* ${formatPrice(grandTotal)}\n\n`;
            message += `*Endereço de Entrega:*\n`;
            message += `${formData.endereco}, ${formData.numero}`;
            if (formData.complemento) message += ` - ${formData.complemento}`;
            message += `\n${formData.bairro}`;
            if (formData.cep) message += ` - CEP: ${formData.cep}`;
            if (formData.referencia) message += `\nRef: ${formData.referencia}`;
        } else {
            message += `*Total:* ${formatPrice(grandTotal)}\n\n`;
            message += `*Retirada no Balcão*`;
        }

        message += `\n\n*Pagamento:* ${paymentMethod === "pix" ? "Pix" :
                paymentMethod === "cartao" ? "Cartão na entrega" :
                    "Dinheiro"
            }`;

        if (orderNotes) {
            message += `\n\n*Observações:* ${orderNotes}`;
        }

        // Open WhatsApp
        const whatsappNumber = "5511999999999"; // Replace with actual number
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");

        // Clear cart and redirect
        clearCart();
        localStorage.removeItem("orderNotes");

        toast({
            title: "Pedido enviado! 🎉",
            description: "Você será redirecionado para o WhatsApp.",
        });

        navigate("/");
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 pb-20 md:pb-0">
                    <div className="container py-20">
                        <div className="max-w-md mx-auto text-center space-y-6">
                            <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
                            <h1 className="text-2xl font-bold">Carrinho vazio</h1>
                            <p className="text-muted-foreground">
                                Adicione produtos para fazer um pedido
                            </p>
                            <Button asChild size="lg">
                                <Link to="/catalogo">Ver Catálogo</Link>
                            </Button>
                        </div>
                    </div>
                </main>
                <Footer />
                <MobileNav />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 pb-20 md:pb-0">
                {/* Progress Header */}
                <section className="bg-muted/50 py-6 border-b">
                    <div className="container">
                        <div className="flex items-center gap-4 mb-4">
                            <Button variant="ghost" size="icon" onClick={handlePrevStep}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <h1 className="text-xl font-bold">Checkout</h1>
                        </div>

                        {/* Steps Indicator */}
                        <div className="flex items-center gap-2">
                            <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"
                                    }`}>
                                    1
                                </div>
                                <span className="text-sm hidden sm:inline">Pagamento</span>
                            </div>
                            <div className="flex-1 h-1 bg-muted rounded">
                                <div className={`h-full bg-primary rounded transition-all ${step >= 2 ? "w-full" : "w-0"}`} />
                            </div>
                            <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"
                                    }`}>
                                    2
                                </div>
                                <span className="text-sm hidden sm:inline">Entrega</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-8">
                    <div className="container">
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">
                                {step === 1 && (
                                    <>
                                        {/* Order Summary */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Package className="h-5 w-5" />
                                                    Resumo do Pedido
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    {items.map((item) => (
                                                        <div key={item.id} className="flex justify-between text-sm">
                                                            <span>
                                                                {item.quantity}x {item.name}
                                                            </span>
                                                            <span className="font-medium">
                                                                {formatPrice(item.price * item.quantity)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Payment Method */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">Forma de Pagamento</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                                                    <div className="grid gap-3">
                                                        <Label
                                                            className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === "pix" ? "border-primary bg-primary/5" : "hover:bg-muted"
                                                                }`}
                                                        >
                                                            <RadioGroupItem value="pix" />
                                                            <Smartphone className="h-5 w-5 text-green-600" />
                                                            <div className="flex-1">
                                                                <p className="font-medium">Pix</p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Pagamento instantâneo
                                                                </p>
                                                            </div>
                                                        </Label>

                                                        <Label
                                                            className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === "cartao" ? "border-primary bg-primary/5" : "hover:bg-muted"
                                                                }`}
                                                        >
                                                            <RadioGroupItem value="cartao" />
                                                            <CreditCard className="h-5 w-5 text-blue-600" />
                                                            <div className="flex-1">
                                                                <p className="font-medium">Cartão na entrega</p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Débito ou crédito
                                                                </p>
                                                            </div>
                                                        </Label>

                                                        <Label
                                                            className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === "dinheiro" ? "border-primary bg-primary/5" : "hover:bg-muted"
                                                                }`}
                                                        >
                                                            <RadioGroupItem value="dinheiro" />
                                                            <Banknote className="h-5 w-5 text-green-700" />
                                                            <div className="flex-1">
                                                                <p className="font-medium">Dinheiro</p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Troco na entrega
                                                                </p>
                                                            </div>
                                                        </Label>
                                                    </div>
                                                </RadioGroup>
                                            </CardContent>
                                        </Card>

                                        {/* Delivery Type */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">Tipo de Entrega</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <RadioGroup value={deliveryType} onValueChange={setDeliveryType}>
                                                    <div className="grid sm:grid-cols-2 gap-3">
                                                        <Label
                                                            className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${deliveryType === "delivery" ? "border-primary bg-primary/5" : "hover:bg-muted"
                                                                }`}
                                                        >
                                                            <RadioGroupItem value="delivery" />
                                                            <div className="flex-1">
                                                                <p className="font-medium">Delivery</p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Taxa: {formatPrice(5)}
                                                                </p>
                                                            </div>
                                                        </Label>

                                                        <Label
                                                            className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${deliveryType === "retirada" ? "border-primary bg-primary/5" : "hover:bg-muted"
                                                                }`}
                                                        >
                                                            <RadioGroupItem value="retirada" />
                                                            <div className="flex-1">
                                                                <p className="font-medium">Retirar no balcão</p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Sem taxa
                                                                </p>
                                                            </div>
                                                        </Label>
                                                    </div>
                                                </RadioGroup>
                                            </CardContent>
                                        </Card>
                                    </>
                                )}

                                {step === 2 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                {deliveryType === "delivery" ? (
                                                    <><MapPin className="h-5 w-5" /> Endereço de Entrega</>
                                                ) : (
                                                    <><User className="h-5 w-5" /> Dados para Retirada</>
                                                )}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="nome">Nome completo *</Label>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            id="nome"
                                                            name="nome"
                                                            placeholder="Seu nome"
                                                            value={formData.nome}
                                                            onChange={handleInputChange}
                                                            className="pl-10"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="telefone">Telefone/WhatsApp *</Label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            id="telefone"
                                                            name="telefone"
                                                            placeholder="(11) 99999-9999"
                                                            value={formData.telefone}
                                                            onChange={handleInputChange}
                                                            className="pl-10"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {deliveryType === "delivery" && (
                                                <>
                                                    <Separator />

                                                    <div className="grid sm:grid-cols-3 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="cep">CEP</Label>
                                                            <Input
                                                                id="cep"
                                                                name="cep"
                                                                placeholder="00000-000"
                                                                value={formData.cep}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                        <div className="sm:col-span-2 space-y-2">
                                                            <Label htmlFor="endereco">Endereço *</Label>
                                                            <Input
                                                                id="endereco"
                                                                name="endereco"
                                                                placeholder="Rua, Avenida..."
                                                                value={formData.endereco}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid sm:grid-cols-3 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="numero">Número *</Label>
                                                            <Input
                                                                id="numero"
                                                                name="numero"
                                                                placeholder="123"
                                                                value={formData.numero}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="complemento">Complemento</Label>
                                                            <Input
                                                                id="complemento"
                                                                name="complemento"
                                                                placeholder="Apto, Bloco..."
                                                                value={formData.complemento}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="bairro">Bairro *</Label>
                                                            <Input
                                                                id="bairro"
                                                                name="bairro"
                                                                placeholder="Centro"
                                                                value={formData.bairro}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="referencia">Ponto de Referência</Label>
                                                        <Input
                                                            id="referencia"
                                                            name="referencia"
                                                            placeholder="Próximo ao..."
                                                            value={formData.referencia}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div>
                                <Card className="sticky top-24">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Total do Pedido</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Subtotal ({itemCount} itens)
                                                </span>
                                                <span>{formatPrice(total)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Entrega</span>
                                                <span>{deliveryFee > 0 ? formatPrice(deliveryFee) : "Grátis"}</span>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="flex justify-between text-xl font-bold">
                                            <span>Total</span>
                                            <span className="text-primary">{formatPrice(grandTotal)}</span>
                                        </div>

                                        {step === 1 ? (
                                            <Button onClick={handleNextStep} className="w-full gap-2" size="lg">
                                                Continuar
                                                <ArrowRight className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button onClick={handleFinishOrder} className="w-full gap-2" size="lg">
                                                <MessageCircle className="h-4 w-4" />
                                                Finalizar pelo WhatsApp
                                            </Button>
                                        )}

                                        <p className="text-xs text-center text-muted-foreground">
                                            Seu pedido será enviado via WhatsApp
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
            <MobileNav />
        </div>
    );
};

export default Checkout;
