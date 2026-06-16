import { Injectable, inject } from '@angular/core';
import { API_CONFIG } from '../../../core/config/api.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateInvoice, CreatePayment, Invoice, Payment } from '../models/invoice';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${API_CONFIG.apiUrl}/invoices`;

  getAll(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.baseUrl}/list`);
  }

  create(createInvoice: CreateInvoice): Observable<Invoice> {
    return this.http.post<Invoice>(this.baseUrl, createInvoice);
  }

  getById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.baseUrl}/${id}`);
  }

  getPayments(invoiceId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/${invoiceId}/payments/list`);
  }

  addPayment(invoiceId: number, payment: CreatePayment): Observable<Payment> {
    return this.http.post<Payment>(`${this.baseUrl}/${invoiceId}/payments/add`, payment);
  }

  getPdf(invoiceId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${invoiceId}/pdf`, { responseType: 'blob' });
  }
}
