"use client"
// components/GenerateInvoicePDF.js
import { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { CustomInvoice, FulfillmentInvoice } from '@/types/invoice';
import { InvoiceContentForPDF } from './pdfInvoice';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Fetch } from '@/lib/actions/fetch';
import { CustomInvoiceContentForPDF } from './pdfInvoiceCustomInvoice';
const PrintPdfBtnCustomInvoice = ({ invoice , client , sender }: {
  invoice: CustomInvoice,
  client: any,
  sender: any
}) => {

  const generatePDF = async () => {
    const invoiceContent = CustomInvoiceContentForPDF({ invoice , client , sender });
    // Use html2pdf to convert the content to a PDF
    const element = document.createElement('div');
    element.innerHTML = invoiceContent;

    const options = {
      margin: 7,
      filename: `Invoice_${invoice._id}.pdf`,
      html2canvas: { dpi: 72, letterRendering: true, useCORS: true  },
      jsPDF: {
        orientation: 'portrait',
        format: 'a4'
        },
      pagebreak: { mode: ['css'] }
    };
    html2pdf().from(element).set(options).save();

  };



  return (
    <div>

      <Button className="bg-red-500 hover:bg-red-700 gap-2" size="lg" onClick={generatePDF}>
        <Download size={20} className="relative -top-[1px]" /> Download PDF
      </Button>

    </div>
  );
};

export default PrintPdfBtnCustomInvoice;
