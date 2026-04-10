import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginDTO } from '../models/auth/login.dto';
import { Usuario } from '../models/auth/usuario.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(dto: LoginDTO): Observable<{ token: string; usuario: Usuario }> {
    return this.http.post<{ token: string; usuario: Usuario }>(`${this.api}/login`, dto);
  }

  getUsuarioActual(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.api}/me`);
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }
}
