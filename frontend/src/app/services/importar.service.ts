import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProductoPreview {
  id: number;
  nombre: string;
  descripcion: string | null;
  categoria: string;
  marca: string | null;
  imagenes: { url: string; description: string | null }[];
  variantes: { name: string; available: number; price: number }[];
  colores: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ImportarService {
  private readonly api = `${environment.apiUrl}/importar`;

  constructor(private http: HttpClient) {}

  ejecutarImportacion(): Observable<any> {
    return this.http.post<any>(`${this.api}/ejecutar`, {});
  }

  obtenerVistaPrevia(): Observable<{ data: { productos: ProductoPreview[] } }> {
    return this.http.get<any>(`${this.api}/vista-previa`);
  }
}

