import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/productos/producto.service';
import { ProductoSeleccionadoService } from '../../services/productos/producto-seleccionado.service';
import { Router } from '@angular/router';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  subcategoria_id: number;
  subcategoria?: string;
  categoria?: string;
  imagenes?: string[];
  rating?: number;
}

@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos-list.html',
  styleUrl: './productos-list.css'
})
export class ProductosList implements OnInit {
  productos: Producto[] = [];
  cargando: boolean = true;
  error: string | null = null;

  constructor(
    private productoService: ProductoService,
    private productoSeleccionadoService: ProductoSeleccionadoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  /**
   * Carga todos los productos desde el servicio
   */
  cargarProductos() {
    this.cargando = true;
    this.error = null;

    this.productoService.obtenerProductos().subscribe({
      next: (datos) => {
        this.productos = datos;
        this.cargando = false;
        console.log('✅ Productos cargados:', this.productos.length);
      },
      error: (err) => {
        console.error('❌ Error al cargar productos:', err);
        this.error = 'Error al cargar los productos. Intenta de nuevo.';
        this.cargando = false;
      }
    });
  }

  /**
   * Formatea el precio con separadores de miles y símbolo de pesos
   * @param precio Precio a formatear
   * @returns Precio formateado
   */
  formatearPrecio(precio: any): string {
    try {
      const num = typeof precio === 'string' ? parseFloat(precio) : precio;
      if (isNaN(num)) {
        return '$0';
      }
      // Formato colombiano: pesos con punto separador de miles
      const formatted = num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return '$' + formatted;
    } catch (error) {
      console.error('Error formateando precio:', error);
      return '$0';
    }
  }

  /**
   * Navega a la página de detalles del producto
   * @param producto Producto seleccionado
   */
  verDetalles(producto: Producto) {
    console.log('Viendo detalles del producto:', producto);
    // Guardar el producto en el servicio
    this.productoSeleccionadoService.setProducto(producto);
    // Navegar a la página de detalles
    this.router.navigate(['/producto-detalle']);
  }
}
