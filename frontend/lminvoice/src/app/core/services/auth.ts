import { Injectable, inject } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../models/login-request';
import { AuthResponse } from '../models/auth-response';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user';
import { RegisterRequest } from '../models/register-request';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private readonly baseUrl = API_CONFIG.baseUrl;
  private readonly apiUrl = API_CONFIG.apiUrl;
  private readonly tokenKey = 'token';
  private readonly tokenExpiresAtKey = 'tokenExpiresAt';
  private readonly userKey = 'user';

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap(response => {
          this.saveToken(response.token);
        })
      );
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/me`);
  }

  register(payload: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/auth/register`, payload);
  }

  saveUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser(): User | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    this.ensureStoredExpiration();

    if (this.isTokenExpired()) {
      this.logout();
      return null;
    }

    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tokenExpiresAtKey);
    localStorage.removeItem(this.userKey);
  }

  hasRole(role: string): boolean {
    const user = this.getUser();
    return !!user?.roles?.includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getUser();
    return roles.some(role => user?.roles?.includes(role));
  }

  getTokenExpiresAt(): number | null {
    const expiresAt = localStorage.getItem(this.tokenExpiresAtKey);
    return expiresAt ? Number(expiresAt) : null;
  }

  isTokenExpired(): boolean {
    this.ensureStoredExpiration();
    const expiresAt = this.getTokenExpiresAt();
    return expiresAt !== null && Date.now() >= expiresAt;
  }

  getSessionRemainingMs(): number {
    this.ensureStoredExpiration();
    const expiresAt = this.getTokenExpiresAt();
    return expiresAt ? Math.max(expiresAt - Date.now(), 0) : 0;
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);

    const expiresAt = this.readJwtExpiration(token);
    if (expiresAt) {
      localStorage.setItem(this.tokenExpiresAtKey, String(expiresAt));
    }
  }

  private ensureStoredExpiration(): void {
    if (localStorage.getItem(this.tokenExpiresAtKey)) {
      return;
    }

    const token = localStorage.getItem(this.tokenKey);
    if (!token) {
      return;
    }

    const expiresAt = this.readJwtExpiration(token);
    if (expiresAt) {
      localStorage.setItem(this.tokenExpiresAtKey, String(expiresAt));
    }
  }

  private readJwtExpiration(token: string): number | null {
    const payload = token.split('.')[1];

    if (!payload) {
      return null;
    }

    try {
      const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(atob(normalizedPayload));
      return decodedPayload.exp ? decodedPayload.exp * 1000 : null;
    } catch {
      return null;
    }
  }
}
