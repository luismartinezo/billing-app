export const API_CONFIG = {
  baseUrl: 'http://localhost:8080',
  apiVersion: '/api/v1',
  get apiUrl(): string {
    return `${this.baseUrl}${this.apiVersion}`;
  }
};
