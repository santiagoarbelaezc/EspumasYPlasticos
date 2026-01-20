import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductoDTO } from '../../models/productos/producto.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductoSeleccionadoService {
  private productoSeleccionado$ = new BehaviorSubject<ProductoDTO | null>(null);

  constructor() {}

  /**
   * Establece el producto seleccionado
   */
  setProducto(producto: ProductoDTO): void {
    this.productoSeleccionado$.next(producto);
  }

  /**
   * Obtiene el producto seleccionado como Observable
   */
  getProducto(): Observable<ProductoDTO | null> {
    return this.productoSeleccionado$.asObservable();
  }

  /**
   * Obtiene el producto seleccionado de forma sincrónica
   */
  getProductoActual(): ProductoDTO | null {
    return this.productoSeleccionado$.value;
  }

  /**
   * Limpia el producto seleccionado
   */
  clearProducto(): void {
    this.productoSeleccionado$.next(null);
  }
}
