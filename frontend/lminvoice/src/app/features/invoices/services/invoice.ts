import { Injectable } from '@angular/core';
import { API_CONFIG } from '../../../core/config/api.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Invoice {
  private readonly baseUrl = `${API_CONFIG.baseUrl}/invoices`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }
}
