import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Producto } from '../../../models/productos/producto';

@Component({
  selector: 'app-grid-productos-interes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './grid-productos-interes.html',
  styleUrls: ['./grid-productos-interes.css']
})
export class GridProductosInteres {
  @Input() productos: Producto[] = [];
  isExpanded = false;
  hoveredIndex: number | null = null;

  get productosVisibles(): Producto[] {
    if (this.isExpanded || this.productos.length <= 6) {
      return this.productos;
    }
    return this.productos.slice(0, 6);
  }

  get mostrarBotonVerMas(): boolean {
    return this.productos.length > 6 && !this.isExpanded;
  }

  toggleExpansion(): void {
    this.isExpanded = !this.isExpanded;
  }

  getTextoBoton(): string {
    return this.isExpanded ? 'Ver menos' : 'Ver más';
  }

  getPrimeraFila(): Producto[] {
    const productos = this.isExpanded ? this.productos : this.productosVisibles;
    return productos.slice(0, Math.ceil(productos.length / 3));
  }

  getSegundaFila(): Producto[] {
    const productos = this.isExpanded ? this.productos : this.productosVisibles;
    const primeraFilaCount = Math.ceil(productos.length / 3);
    return productos.slice(primeraFilaCount, primeraFilaCount * 2);
  }

  getTerceraFila(): Producto[] {
    const productos = this.isExpanded ? this.productos : this.productosVisibles;
    const primeraFilaCount = Math.ceil(productos.length / 3);
    return productos.slice(primeraFilaCount * 2);
  }

  formatearPrecio(precio?: number): string {
    if (!precio) return '';
    return `$${precio.toLocaleString('es-CO')}`;
  }

  setHoveredIndex(index: number | null): void {
    this.hoveredIndex = index;
  }
}