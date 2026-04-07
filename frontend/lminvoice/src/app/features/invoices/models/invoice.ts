
export interface InvoiceItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface Invoice {
  id?: number;
  customerId: number;
  items: InvoiceItem[];
  invoiceNumber?: string;
  customer?: { id: number; name: string };
  total?: number;
  status?: string;
}

export interface CreateInvoice {
  customer: { id: number };
  items: { product: { id: number }; quantity: number }[];
}
