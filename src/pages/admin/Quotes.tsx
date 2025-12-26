import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-external";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp, Trash2, FileDown } from "lucide-react";
import { generateQuotePDF } from "@/lib/generateQuotePDF";
import { createRenewalReminder } from "@/lib/renewalReminders";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => { fetchQuotes(); }, []);

  const fetchQuotes = async () => {
    const { data, error } = await supabase.from("quotes").select("*").order("created_at", { ascending: false });
    if (error) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível carregar os orçamentos." });
    } else {
      setQuotes(data || []);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      pending: { label: "Pendente", className: "bg-yellow-100 text-yellow-800 border border-yellow-200" },
      approved: { label: "Aprovado", className: "bg-green-100 text-green-800 border border-green-200" },
      rejected: { label: "Rejeitado", className: "bg-red-100 text-red-800 border border-red-200" },
    };
    const statusInfo = statusMap[status] || { label: status, className: "bg-muted text-foreground" };
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.className}`}>{statusInfo.label}</span>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => { const newSet = new Set(prev); if (newSet.has(id)) newSet.delete(id); else newSet.add(id); return newSet; });
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { data, error } = await supabase.from("quotes").update({ status: newStatus }).eq("id", id).select().single();
    if (error) { toast({ variant: "destructive", title: "Erro ao atualizar status", description: `${error.message}` }); return; }
    if (newStatus === "approved" && data) {
      try { await createRenewalReminder(data.id, data.customer_name, data.customer_email, data.customer_phone); toast({ title: "Sucesso", description: "Status atualizado e lembrete criado." }); }
      catch { toast({ title: "Status atualizado", description: "Erro ao criar lembrete." }); }
    } else { toast({ title: "Sucesso", description: "Status atualizado." }); }
    fetchQuotes();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Excluir este orçamento?")) return;
    const { error } = await supabase.from("quotes").delete().eq("id", id);
    if (error) { toast({ variant: "destructive", title: "Erro", description: "Não foi possível excluir." }); }
    else { toast({ title: "Sucesso", description: "Orçamento excluído." }); fetchQuotes(); }
  };

  return (
    <AdminLayout title="Orçamentos" subtitle="Gestão de orçamentos">
      <Card>
        <CardHeader><CardTitle>Lista de Orçamentos</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]" />
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((quote) => (
                <React.Fragment key={quote.id}>
                  <TableRow className="hover:bg-muted/40" onClick={() => toggleRow(quote.id)}>
                    <TableCell>{expandedRows.has(quote.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</TableCell>
                    <TableCell>{formatDate(quote.created_at)}</TableCell>
                    <TableCell className="font-medium">{quote.customer_name}</TableCell>
                    <TableCell>{quote.customer_email || "-"}</TableCell>
                    <TableCell>{quote.customer_phone}</TableCell>
                    <TableCell>{Array.isArray(quote.items) ? quote.items.length : 0}</TableCell>
                    <TableCell>
                      <Select value={quote.status} onValueChange={(v) => handleStatusChange(quote.id, v)}>
                        <SelectTrigger className="w-28"><SelectValue>{getStatusBadge(quote.status)}</SelectValue></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="approved">Aprovado</SelectItem>
                          <SelectItem value="rejected">Rejeitado</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={async (e) => { e.stopPropagation(); await generateQuotePDF(quote); }} title="PDF"><FileDown className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(quote.id); }} title="Excluir"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(quote.id) && (
                    <TableRow>
                      <TableCell colSpan={8} className="bg-muted/40">
                        <div className="p-4 space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Produtos</h4>
                            {Array.isArray(quote.items) && quote.items.length > 0 ? (
                              <div className="space-y-2">
                                {quote.items.map((item: any, idx: number) => (
                                  <div key={idx} className="flex justify-between items-center p-2 bg-background rounded">
                                    <div><p className="font-medium">{item.product_name}</p><p className="text-xs text-muted-foreground">{item.product_type}</p></div>
                                    <div className="text-right text-xs"><p>Qtd: {item.quantity}</p></div>
                                  </div>
                                ))}
                              </div>
                            ) : <p className="text-sm text-muted-foreground">Nenhum item.</p>}
                          </div>
                          {quote.notes && <div><h4 className="font-semibold mb-2">Obs</h4><p className="text-sm whitespace-pre-wrap">{quote.notes}</p></div>}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
              {quotes.length === 0 && <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">Nenhum orçamento.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default Quotes;
