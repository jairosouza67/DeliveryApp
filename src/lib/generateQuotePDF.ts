import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface QuoteItem {
  product_name: string;
  product_type: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface QuoteData {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  items: QuoteItem[];
  total_value: number;
  status: string;
  notes: string | null;
  created_at: string;
}

export const generateQuotePDF = async (quote: QuoteData) => {
  const doc = new jsPDF();
  
  // Load logo
  const response = await fetch('/logo-arseg.jpg');
  const blob = await response.blob();
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  await new Promise(resolve => reader.onload = resolve);
  const imgData = reader.result as string;
  
  // Add logo centered at top
  doc.addImage(imgData, 'JPEG', 75, 10, 60, 20); // Adjust position and size as needed
  
  // Company header
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("ARSEG EXTINTORES", 105, 40, { align: "center" });
  
  // Quote title
  doc.setFontSize(14);
  doc.text("ORÇAMENTO", 105, 50, { align: "center" });
  
  // Quote Info
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Número: ${quote.id.substring(0, 8).toUpperCase()}`, 14, 65);
  doc.text(`Data: ${new Date(quote.created_at).toLocaleDateString("pt-BR")}`, 14, 71);
  
  // Status
  const statusMap: Record<string, string> = {
    pending: "Pendente",
    approved: "Aprovado",
    rejected: "Rejeitado",
  };
  doc.text(`Status: ${statusMap[quote.status] || quote.status}`, 14, 77);
  
  // Customer Info
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("DADOS DO CLIENTE", 14, 90);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Nome: ${quote.customer_name}`, 14, 98);
  if (quote.customer_email) {
    doc.text(`Email: ${quote.customer_email}`, 14, 104);
  }
  doc.text(`Telefone: ${quote.customer_phone}`, 14, 110);
  
  // Items Table
  const tableData = quote.items.map((item) => [
    item.product_name,
    item.product_type,
    item.quantity.toString(),
  ]);
  
  autoTable(doc, {
    startY: 120,
    head: [["Produto", "Tipo", "Quantidade"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [66, 66, 66],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: {
      fontSize: 9,
    },
    columnStyles: {
      2: { halign: "center" },
    },
  });
  
  // Contact Info
  const finalY = (doc as any).lastAutoTable.finalY || 120;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(220, 38, 38); // Red color for emphasis
  doc.text("VALORES SOB CONSULTA", 105, finalY + 10, { align: "center" });
  doc.setTextColor(0, 0, 0); // Reset to black
  doc.setFont("helvetica", "normal");
  doc.text("Nosso vendedor entrará em contato para informar valores e condições de pagamento.", 105, finalY + 18, { align: "center" });
  
  // Notes
  if (quote.notes) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("OBSERVAÇÕES:", 14, finalY + 30);
    
    doc.setFont("helvetica", "normal");
    const splitNotes = doc.splitTextToSize(quote.notes, 180);
    doc.text(splitNotes, 14, finalY + 37);
  }
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text("Este documento é apenas um orçamento e não representa uma nota fiscal.", 105, pageHeight - 15, { align: "center" });
  
  // Save
  const fileName = `orcamento_${quote.customer_name.replace(/\s+/g, "_")}_${quote.id.substring(0, 8)}.pdf`;
  doc.save(fileName);
};
