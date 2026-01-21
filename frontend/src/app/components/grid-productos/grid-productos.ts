import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Producto } from '../../models/productos/producto';

@Component({
  selector: 'app-grid-productos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './grid-productos.html',
  styleUrls: ['./grid-productos.css']
})
export class GridProductosComponent {
  @Input() productos: Producto[] = [];
  hoveredIndex: number | null = null;
  
  get primeraFila(): Producto[] {
    return this.productos.slice(0, 4);
  }
  
  get segundaFila(): Producto[] {
    return this.productos.slice(4, 8);
  }

  formatearPrecio(precio?: number): string {
    if (!precio) return '';
    return `$${precio.toLocaleString('es-CO')}`;
  }

  setHoveredIndex(index: number | null): void {
    this.hoveredIndex = index;
  }
}