import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/productos/producto.service';
import { SubcategoriaSeleccionadaService } from '../../services/productos/subcategoria-seleccionada.service';
import { ProductoSeleccionadoService } from '../../services/productos/producto-seleccionado.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
export class ProductosList implements OnInit, OnDestroy {
  productos: Producto[] = [];
  cargando: boolean = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private productoService: ProductoService,
    private subcategoriaSeleccionadaService: SubcategoriaSeleccionadaService,
    private productoSeleccionadoService: ProductoSeleccionadoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    // Suscribirse a cambios en los query params de la ruta
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const subcategoriaId = params['subcategoria_id'] ? parseInt(params['subcategoria_id'], 10) : null;
        const categoriaId = params['categoria_id'] ? parseInt(params['categoria_id'], 10) : null;
        
        // Actualizar el servicio con la subcategoría de los query params
        if (subcategoriaId) {
          this.subcategoriaSeleccionadaService.setSubcategoriaSeleccionada(subcategoriaId);
        } else {
          this.subcategoriaSeleccionadaService.resetear();
        }
        
        // Cargar productos
        this.cargarProductos(subcategoriaId);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga productos según la subcategoría seleccionada
   * Si subcategoriaId es null, carga todos los productos
   */
  cargarProductos(subcategoriaId: number | null = null) {
    this.cargando = true;
    this.error = null;

    const observablProductos$ = subcategoriaId 
      ? this.productoService.obtenerProductosPorSubcategoria(subcategoriaId)
      : this.productoService.obtenerProductos();

    observablProductos$.pipe(takeUntil(this.destroy$)).subscribe({
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
    // Guardar el producto en el servicio (como respaldo)
    this.productoSeleccionadoService.setProducto(producto);
    // Navegar a la página de detalles con el ID
    this.router.navigate(['/producto', producto.id, 'detalle-producto-espumasyplasticos']);
  }
}
