import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Producto } from '../../models/productos/producto';

export interface TrioProducto extends Producto {
  categoria?: string;
  esDestacado?: boolean;
}

@Component({
  selector: 'app-trio-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './trio-card.html',
  styleUrls: ['./trio-card.css']
})
export class TrioCard {
  @Input() titulo: string = '';
  @Input() subtitulo: string = '';
  @Input() productos: TrioProducto[] = [];
  @Input() mostrarPrecios: boolean = true;
  
  hoveredIndex: number | null = null;

  setHoveredIndex(index: number | null): void {
    this.hoveredIndex = index;
  }

  formatearPrecio(precio?: number): string {
    if (!precio) return '';
    return `$${precio.toLocaleString('es-CO')}`;
  }

  // Asegurarnos de que siempre tenemos exactamente 3 productos
  get productosParaMostrar(): TrioProducto[] {
    const productosMostrar = [...this.productos];
    
    // Si hay menos de 3 productos, añadimos placeholders
    while (productosMostrar.length < 3) {
      productosMostrar.push({
        id: -1,
        imagen: '',
        descripcion: '',
        link: '#',
        altura: 'baja' as const,
        nombre: 'Producto no disponible',
        precio: 0
      });
    }
    
    return productosMostrar.slice(0, 3);
  }

  esPlaceholder(producto: TrioProducto): boolean {
    return producto.id === -1;
  }
}