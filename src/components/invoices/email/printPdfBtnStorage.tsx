"use client";

import html2pdf from 'html2pdf.js';
import { StorageInvoice } from "@/types/invoice";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrintPdfBtnStorage = ({ invoice, emailHtml }: { invoice: StorageInvoice, emailHtml: string }) => {
  const generatePDF = async () => {
    const element = document.createElement('div');
    element.innerHTML = emailHtml;
    
    const options = {
      margin: 7,
      filename: `Invoice_${invoice._id}.pdf`,
      html2canvas: { dpi: 72, letterRendering: true, useCORS: true },
      jsPDF: { orientation: 'portrait', format: 'a4' },
      pagebreak: { mode: ['css'] }
    };
    html2pdf().from(element).set(options).save();
  };

  return (
    <Button className="bg-red-500 hover:bg-red-700 gap-2" size="lg" onClick={generatePDF}>
      <Download size={20} className="relative -top-[1px]" /> Download PDF
    </Button>
  );
};

export default PrintPdfBtnStorage;
