export type FulfillmentInvoice = {
  _id: string;
  client: string;
  from: string;
  to: string;
  channels?: number[];
  expenseCause: string;
  expenseValue: number;
  orders: {
    id: string;
    date: number;
    totalWeight: number;
    carrier: string;
    service: string;
    postcode: string;
    channel: string;
    trackingNumber: string;
    shippingWeightGroup: any;
    handlingWeightGroup: any;
    charges: {
      postage: number;
      surge: number;
      handling: number;
      packaging: number;
      prepCharge: number;
    };
  }[];
  services: {
    carrier: string;
    service: string;
    charges: {
      postage: number;
      surge: number;
      handling: number;
      packaging: number;
      prepCharge: number;
    };
    total: number;
    problems: any[];
    printed?: boolean;
    printedDate?: string;
  }[];
  totals: {
    totalPostage: number;
    totalSurge: number;
    totalHandling: number;
    totalPackaging: number;
    totalPrep: number;
    total: number;
    totalTax: number;
  };
  createdAt: any;
  lastMessageId?: string;
  emailedDate?: any;
  clientEmail?: string;
  clientAddress?: string;
  clientBusinessName?: string;
  dateRange: dateRange;
};

type dateRange = {
  from: string;
  to: string;
}

export  type StorageInvoice = {
  _id: string;
  from: string;
  to: string;
  client: string;
  clientAddress: string;
  clientBusinessName: string;
  items: any[];
  monthlySubtotal: number;
  weeklySubTotal: number;
  totalStorageSpace: number;
  printed?: boolean;
  printedDate?: string;
  lastMessageId?: string;
  emailedDate?: any;
  clientEmail?: string;
  createdAt: any;
  storageStartMonth: number;
  dateRange: string;
};


export type CustomInvoiceItem= {
  description: string;
  qty: number;
  price: number;
  itemId: string;
}

export type CustomInvoice= {
  _id?: string;
  client: string;
  sender: string;
  date: Date | string;
  items: CustomInvoiceItem[];
  discount: number;
  discountType: string;
  subtotal: number;
  taxRate: number;
  total: number;
  itemsNo?: number;
  showPayments: boolean;
}