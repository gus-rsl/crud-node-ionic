// src/app/services/data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'http://localhost:3000'; // Ajusta la URL de tu servidor Node.js

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`);
  }

  getUsuarioPorEmail(email: string): Observable<any> {
    // Escapamos el email para evitar posibles ataques de SQL Injection
    const escapedEmail = encodeURIComponent(email);

    return this.http.get<any>(`${this.apiUrl}/usuarios/email/${escapedEmail}`);
  }

  crearUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/crear`, usuario);
  }

  actualizarUsuario(email: string, usuario: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/actualizar/${email}`, usuario);
  }

  eliminarUsuario(email: string): Observable<any> {
    // Escapamos el email para evitar posibles ataques de SQL Injection
    const escapedEmail = encodeURIComponent(email);

    return this.http.delete<any>(`${this.apiUrl}/eliminar/${escapedEmail}`);
  }
}
