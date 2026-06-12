import { Injectable, inject } from '@angular/core';
import { API_CONFIG } from '../../../core/config/api.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice, CreateInvoice } from '../models/invoice';

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
}
