import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaDTO } from '../../models/categorias/categoria.dto';
import { CategoriaConSubcategoriasDTO } from '../../models/categorias/categoria-sub.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = `${environment.apiUrl}/categoria`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todas las categorías, opcionalmente filtradas
   * @param nombre Término de búsqueda opcional
   * @returns Observable<CategoriaDTO[]>
   */
  obtenerCategorias(nombre?: string): Observable<CategoriaDTO[]> {
    let params = new HttpParams();
    if (nombre) {
      params = params.set('nombre', nombre);
    }
    return this.http.get<CategoriaDTO[]>(this.apiUrl, { params });
  }

  /**
   * Obtener categorías con subcategorías y cantidad de productos
   * @returns Observable<CategoriaConSubcategoriasDTO[]>
   */
  obtenerCategoriasConSubcategorias(): Observable<CategoriaConSubcategoriasDTO[]> {
    return this.http.get<CategoriaConSubcategoriasDTO[]>(`${this.apiUrl}/con-subcategorias`);
  }

  /**
   * Crear nueva categoría con ícono (opcional)
   * FormData debe incluir:
   * - nombre: string (requerido)
   * - icono: File (opcional)
   * @param data FormData con nombre e icono
   * @returns Observable<any>
   */
  crearCategoria(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  /**
   * Actualizar categoría (nombre y/o ícono)
   * FormData debe incluir:
   * - nombre: string (requerido)
   * - icono: File (opcional)
   * @param id ID de la categoría
   * @param data FormData con nombre e icono
   * @returns Observable<any>
   */
  actualizarCategoria(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Eliminar categoría (también elimina ícono de Cloudinary)
   * @param id ID de la categoría
   * @returns Observable<any>
   */
  eliminarCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
