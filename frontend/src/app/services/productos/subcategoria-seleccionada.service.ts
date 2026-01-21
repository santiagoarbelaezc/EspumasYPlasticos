import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Servicio para gestionar la subcategoría seleccionada
 * Permite la comunicación entre el menú de categorías y la lista de productos
 */
@Injectable({
  providedIn: 'root'
})
export class SubcategoriaSeleccionadaService {
  
  // BehaviorSubject para mantener la subcategoría seleccionada
  // null significa "mostrar todos los productos"
  private subcategoriaSeleccionada$ = new BehaviorSubject<number | null>(null);

  constructor() {}

  /**
   * Observable que emite cuando cambia la subcategoría seleccionada
   */
  getSubcategoriaSeleccionada(): Observable<number | null> {
    return this.subcategoriaSeleccionada$.asObservable();
  }

  /**
   * Establece la subcategoría seleccionada
   * @param subcategoriaId ID de la subcategoría, o null para mostrar todos
   */
  setSubcategoriaSeleccionada(subcategoriaId: number | null): void {
    this.subcategoriaSeleccionada$.next(subcategoriaId);
  }

  /**
   * Obtiene el valor actual de la subcategoría seleccionada
   */
  getValorActual(): number | null {
    return this.subcategoriaSeleccionada$.value;
  }

  /**
   * Resetea la selección a "mostrar todos"
   */
  resetear(): void {
    this.subcategoriaSeleccionada$.next(null);
  }
}
