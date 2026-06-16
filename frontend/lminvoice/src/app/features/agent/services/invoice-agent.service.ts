import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../core/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class InvoiceAgentService {
  private http = inject(HttpClient);
  private readonly agentUrl = `${API_CONFIG.apiUrl}/ai/chat`;

  ask(message: string): Observable<string> {
    return this.http.post(this.agentUrl, { message }, { responseType: 'text' });
  }
}
