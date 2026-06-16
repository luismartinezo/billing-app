
export interface InvoiceItem {
  productId: number;
  productName?: string;
  quantity: number;
  price: number;
  total?: number;
}

export interface Invoice {
  id?: number;
  customerId?: number;
  items: InvoiceItem[];
  invoiceNumber?: string;
  createdAt?: string;
  issueDate?: string;
  dueDate?: string;
  paidAt?: string;
  subtotal?: number;
  taxAmount?: number;
  customer?: { id: number; name: string; email?: string };
  total?: number;
  status?: string;
}

export interface CreateInvoice {
  customer: { id: number };
  items: { product: { id: number }; quantity: number }[];
}

export type PaymentMethod = 'CASH' | 'TRANSFER' | 'CARD';

export interface Payment {
  id: number;
  amount: number;
  paidAt: string;
  method: PaymentMethod;
  invoiceId: number;
}

export interface CreatePayment {
  amount: number;
  method: PaymentMethod;
}
