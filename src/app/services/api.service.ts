import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000'; // Asegúrate de que coincida con tu backend

  constructor(private http: HttpClient) {}

  // Método para test de conexión
  getHello(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  // ✅ Método de login (POST con email y contraseña)
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }
}
