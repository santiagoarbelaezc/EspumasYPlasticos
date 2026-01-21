import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductoDTO } from '../../models/productos/producto.dto';

/**
 * Servicio para gestionar productos
 * Proporciona métodos para obtener, crear, actualizar y eliminar productos
 */
@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:3000/api/producto';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los productos con sus imágenes
   * @returns Observable con array de ProductoDTO
   */
  obtenerProductos(): Observable<ProductoDTO[]> {
    return this.http.get<ProductoDTO[]>(this.apiUrl);
  }

  /**
   * Obtiene productos filtrados por subcategoría
   * @param subcategoriaId ID de la subcategoría para filtrar
   * @returns Observable con array de ProductoDTO filtrados
   */
  obtenerProductosPorSubcategoria(subcategoriaId: number): Observable<ProductoDTO[]> {
    let params = new HttpParams();
    params = params.set('subcategoria_id', subcategoriaId.toString());
    return this.http.get<ProductoDTO[]>(this.apiUrl, { params });
  }

  /**
   * Obtiene un producto específico por ID
   * @param id ID del producto
   * @returns Observable con ProductoDTO
   */
  obtenerProductoPorId(id: number): Observable<ProductoDTO> {
    return this.http.get<ProductoDTO>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo producto con múltiples imágenes
   * @param nombre Nombre del producto
   * @param descripcion Descripción del producto
   * @param cantidad Cantidad disponible
   * @param precio Precio del producto
   * @param subcategoriaId ID de la subcategoría
   * @param imagenes Archivos de imagen (máximo 5)
   * @returns Observable con respuesta del servidor
   */
  crearProducto(
    nombre: string,
    descripcion: string,
    cantidad: number,
    precio: number,
    subcategoriaId: number,
    imagenes: File[]
  ): Observable<any> {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('cantidad', cantidad.toString());
    formData.append('precio', precio.toString());
    formData.append('subcategoria_id', subcategoriaId.toString());

    imagenes.forEach(imagen => {
      formData.append('imagenes', imagen);
    });

    return this.http.post<any>(this.apiUrl, formData);
  }

  /**
   * Actualiza un producto existente
   * @param id ID del producto
   * @param nombre Nombre del producto
   * @param descripcion Descripción del producto
   * @param cantidad Cantidad disponible
   * @param precio Precio del producto
   * @param subcategoriaId ID de la subcategoría
   * @param imagenes Archivos de imagen nuevas (opcional, máximo 5)
   * @returns Observable con respuesta del servidor
   */
  actualizarProducto(
    id: number,
    nombre: string,
    descripcion: string,
    cantidad: number,
    precio: number,
    subcategoriaId: number,
    imagenes?: File[]
  ): Observable<any> {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('cantidad', cantidad.toString());
    formData.append('precio', precio.toString());
    formData.append('subcategoria_id', subcategoriaId.toString());

    if (imagenes && imagenes.length > 0) {
      imagenes.forEach(imagen => {
        formData.append('imagenes', imagen);
      });
    }

    return this.http.put<any>(`${this.apiUrl}/${id}`, formData);
  }

  /**
   * Elimina un producto y todas sus imágenes
   * @param id ID del producto
   * @returns Observable con respuesta del servidor
   */
  eliminarProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
    /**
     * Obtiene productos aleatorios
     * @param cantidad Número de productos aleatorios a obtener (opcional, por defecto 5)
     * @returns Observable con array de ProductoDTO
     */
    obtenerProductosAleatorios(cantidad: number = 5): Observable<ProductoDTO[]> {
      let params = new HttpParams().set('cantidad', cantidad.toString());
      return this.http.get<ProductoDTO[]>(`${this.apiUrl}/aleatorios`, { params });
    }

    /**
     * Obtiene todos los productos que pertenecen a una categoría
     * @param categoriaId ID de la categoría
     * @returns Observable con array de ProductoDTO
     */
    obtenerProductosPorCategoria(categoriaId: number): Observable<ProductoDTO[]> {
      return this.http.get<ProductoDTO[]>(`${this.apiUrl}/categoria/${categoriaId}`);
    }
    /**
     * Busca productos por nombre o similares
     * @param nombre Término de búsqueda
     * @returns Observable con array de ProductoDTO
     */
    buscarProductosPorNombre(nombre: string): Observable<ProductoDTO[]> {
      const params = new HttpParams().set('nombre', nombre);
      return this.http.get<ProductoDTO[]>(`${this.apiUrl}/buscar/nombre`, { params });
    }
}
