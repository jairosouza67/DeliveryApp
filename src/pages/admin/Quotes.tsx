import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase-external";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ChevronDown, ChevronUp, Trash2, FileDown } from "lucide-react";
import { generateQuotePDF } from "@/lib/generateQuotePDF";
import { createRenewalReminder } from "@/lib/renewalReminders";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Quote {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  items: any;
  total_value: number;
  status: string;
  notes: string | null;
  created_at: string;
}

const Quotes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os orçamentos.",
      });
    } else {
      setQuotes(data || []);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { label: string; className: string }
    > = {
      pending: {
        label: "Pendente",
        className:
          "bg-yellow-100 text-yellow-800 border border-yellow-200",
      },
      approved: {
        label: "Aprovado",
        className:
          "bg-green-100 text-green-800 border border-green-200",
      },
      rejected: {
        label: "Rejeitado",
        className:
          "bg-red-100 text-red-800 border border-red-200",
      },
    };

    const statusInfo =
      statusMap[status] || {
        label: status,
        className: "bg-muted text-foreground",
      };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.className}`}
      >
        {statusInfo.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { data, error } = await supabase
      .from("quotes")
      .update({ status: newStatus })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Erro detalhado ao atualizar status:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: `${error.message} (Código: ${error.code})`,
      });
      return;
    }

    if (newStatus === "approved") {
      const quote = data;
      if (quote) {
        try {
          await createRenewalReminder(
            quote.id,
            quote.customer_name,
            quote.customer_email,
            quote.customer_phone
          );
          toast({
            title: "Sucesso",
            description:
              "Status atualizado e lembrete de renovação criado.",
          });
        } catch (reminderError) {
          console.error("Erro ao criar lembrete:", reminderError);
          toast({
            title: "Status atualizado",
            description:
              "Orçamento aprovado, mas houve erro ao criar lembrete de renovação.",
          });
        }
      } else {
        toast({
          title: "Sucesso",
          description: "Status atualizado com sucesso.",
        });
      }
    } else {
      toast({
        title: "Sucesso",
        description: "Status atualizado com sucesso.",
      });
    }

    fetchQuotes();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este orçamento?"))
      return;

    const { error } = await supabase
      .from("quotes")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir o orçamento.",
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Orçamento excluído com sucesso.",
      });
      fetchQuotes();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold">Orçamentos</h1>
            <p className="text-muted-foreground">
              Todos os orçamentos enviados pelo site, de usuários logados ou
              visitantes, aparecem aqui para gestão interna.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Orçamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]" />
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Qtd Itens</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[140px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.map((quote) => (
                  <React.Fragment key={quote.id}>
                    <TableRow
                      className="hover:bg-muted/40"
                      onClick={() => toggleRow(quote.id)}
                    >
                      <TableCell className="align-top">
                        {expandedRows.has(quote.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </TableCell>
                      <TableCell className="align-top">
                        {formatDate(quote.created_at)}
                      </TableCell>
                      <TableCell className="align-top font-medium">
                        {quote.customer_name}
                      </TableCell>
                      <TableCell className="align-top">
                        {quote.customer_email || "-"}
                      </TableCell>
                      <TableCell className="align-top">
                        {quote.customer_phone}
                      </TableCell>
                      <TableCell className="align-top">
                        {Array.isArray(quote.items)
                          ? quote.items.length
                          : 0}
                      </TableCell>
                      <TableCell className="align-top">
                        <Select
                          value={quote.status}
                          onValueChange={(value) =>
                            handleStatusChange(quote.id, value)
                          }
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue>
                              {getStatusBadge(quote.status)}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">
                              Pendente
                            </SelectItem>
                            <SelectItem value="approved">
                              Aprovado
                            </SelectItem>
                            <SelectItem value="rejected">
                              Rejeitado
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={async (e) => {
                              e.stopPropagation();
                              await generateQuotePDF(quote);
                            }}
                            title="Baixar PDF"
                          >
                            <FileDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(quote.id);
                            }}
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedRows.has(quote.id) && (
                      <TableRow>
                        <TableCell colSpan={8} className="bg-muted/40">
                          <div className="p-4 space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">
                                Produtos solicitados
                              </h4>
                              {Array.isArray(quote.items) &&
                              quote.items.length > 0 ? (
                                <div className="space-y-2">
                                  {quote.items.map(
                                    (
                                      item: any,
                                      idx: number
                                    ) => (
                                      <div
                                        key={idx}
                                        className="flex justify-between items-center p-2 bg-background rounded"
                                      >
                                        <div>
                                          <p className="font-medium">
                                            {item.product_name}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            {item.product_type}
                                          </p>
                                        </div>
                                        <div className="text-right text-xs">
                                          <p>
                                            Quantidade:{" "}
                                            {item.quantity}
                                          </p>
                                          <p>
                                            Preço: a combinar
                                          </p>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  Nenhum item registrado.
                                </p>
                              )}
                            </div>
                            {quote.notes && (
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Observações do cliente
                                </h4>
                                <p className="text-sm whitespace-pre-wrap">
                                  {quote.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
                {quotes.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground py-8"
                    >
                      Nenhum orçamento encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Quotes;
