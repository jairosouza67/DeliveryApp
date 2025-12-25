import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Phone,
  Clock,
  MapPin,
  Store,
  Truck,
  Instagram,
  Facebook
} from "lucide-react";

const deliveryAreas = [
  "Centro",
  "Zona Sul",
  "Zona Oeste",
  "Vila Mariana",
  "Moema",
  "Pinheiros",
  "Consolação",
  "Bela Vista",
];

const Contato = () => {
  const whatsappNumber = "5511999999999";
  const whatsappMessage = encodeURIComponent("Olá! Gostaria de fazer um pedido.");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pb-20 md:pb-0">
        {/* Page Header */}
        <section className="bg-gradient-hero py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4 animate-fade-in">
              <Badge className="bg-white/20 text-white">
                Fale Conosco
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground">
                Contato & Localização
              </h1>
              <p className="text-xl text-primary-foreground/90">
                Estamos prontos para atender você!
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8">
              {/* WhatsApp CTA */}
              <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <MessageCircle className="h-6 w-6" />
                    WhatsApp
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-green-800 dark:text-green-200">
                    Faça seu pedido diretamente pelo WhatsApp! Atendimento rápido e personalizado.
                  </p>
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Chamar no WhatsApp
                    </a>
                  </Button>
                  <p className="text-sm text-green-700 dark:text-green-300 text-center">
                    (11) 99999-9999
                  </p>
                </CardContent>
              </Card>

              {/* Telefone */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-6 w-6 text-primary" />
                    Telefone
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Ligue para nós para tirar dúvidas ou fazer pedidos.
                  </p>
                  <Button asChild variant="outline" size="lg" className="w-full">
                    <a href="tel:+5511999999999">
                      <Phone className="mr-2 h-5 w-5" />
                      (11) 99999-9999
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {/* Horário */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    Horário de Funcionamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Segunda a Sábado</span>
                    <span className="font-medium">10h às 22h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Domingo e Feriados</span>
                    <span className="font-medium">12h às 20h</span>
                  </div>
                </CardContent>
              </Card>

              {/* Entrega */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Truck className="h-5 w-5 text-primary" />
                    Delivery
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxa de entrega</span>
                    <span className="font-medium">R$ 5,00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pedido mínimo</span>
                    <span className="font-medium">R$ 30,00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tempo estimado</span>
                    <span className="font-medium">30-50 min</span>
                  </div>
                </CardContent>
              </Card>

              {/* Retirada */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Store className="h-5 w-5 text-primary" />
                    Retirada no Balcão
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground text-sm">
                    Você também pode retirar seu pedido em nossa loja e economizar na taxa de entrega!
                  </p>
                  <Badge variant="secondary" className="w-full justify-center">
                    Sem taxa para retirada
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Área de Entrega */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Área de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Atendemos os seguintes bairros e regiões:
                </p>
                <div className="flex flex-wrap gap-2">
                  {deliveryAreas.map((area) => (
                    <Badge key={area} variant="outline" className="px-3 py-1">
                      {area}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Não encontrou seu bairro? Entre em contato pelo WhatsApp para verificar disponibilidade.
                </p>
              </CardContent>
            </Card>

            {/* Endereço */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  Nosso Endereço (Retirada)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">BebeMais Distribuidora</p>
                <p className="text-muted-foreground">
                  Rua das Bebidas, 123 - Centro<br />
                  São Paulo - SP, 01234-567
                </p>
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" asChild>
                    <a
                      href="https://www.google.com/maps"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Ver no Mapa
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Redes Sociais */}
            <div className="mt-8 text-center">
              <h3 className="text-lg font-semibold mb-4">Siga-nos nas redes sociais</h3>
              <div className="flex justify-center gap-4">
                <Button variant="outline" size="lg" asChild>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <Instagram className="mr-2 h-5 w-5" />
                    Instagram
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <Facebook className="mr-2 h-5 w-5" />
                    Facebook
                  </a>
                </Button>
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

export default Contato;
