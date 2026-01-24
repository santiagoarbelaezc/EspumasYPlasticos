import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/productos/producto.service';
import { ProductosExampleService } from '../../services/productos.example';
import { SubcategoriaSeleccionadaService } from '../../services/productos/subcategoria-seleccionada.service';
import { ProductoSeleccionadoService } from '../../services/productos/producto-seleccionado.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, of } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

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
  terminoBusqueda: string = '';
  modoBusqueda: boolean = false;
  mensajeResultados: string = 'Todos los Productos';
  private destroy$ = new Subject<void>();

  constructor(
    private productoService: ProductoService,
    private productosExampleService: ProductosExampleService,
    private subcategoriaSeleccionadaService: SubcategoriaSeleccionadaService,
    private productoSeleccionadoService: ProductoSeleccionadoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    // Suscribirse a cambios en los query params de la ruta
    this.activatedRoute.queryParams
      .pipe(
        takeUntil(this.destroy$),
        switchMap(params => {
          const subcategoriaId = params['subcategoria_id'] ? parseInt(params['subcategoria_id'], 10) : null;
          const categoriaId = params['categoria_id'] ? parseInt(params['categoria_id'], 10) : null;
          const busqueda = params['busqueda'] || '';
          const tipo = params['tipo'] || '';
          
          this.terminoBusqueda = busqueda;
          this.modoBusqueda = !!busqueda && tipo === 'nombre';
          
          // Actualizar el servicio con la subcategoría de los query params
          if (subcategoriaId) {
            this.subcategoriaSeleccionadaService.setSubcategoriaSeleccionada(subcategoriaId);
          } else {
            this.subcategoriaSeleccionadaService.resetear();
          }
          
          // Determinar qué tipo de carga realizar
          if (this.modoBusqueda && this.terminoBusqueda.trim()) {
            return this.cargarProductosPorBusqueda(this.terminoBusqueda);
          } else if (subcategoriaId) {
            return this.cargarProductosPorSubcategoria(subcategoriaId);
          } else {
            return this.cargarTodosLosProductos();
          }
        })
      )
      .subscribe({
        next: (datos) => {
          this.productos = datos;
          this.cargando = false;
          this.actualizarMensajeResultados();
          console.log('✅ Productos cargados:', this.productos.length);
        },
        error: (err) => {
          console.error('❌ Error al cargar productos:', err);
          this.error = 'Error al cargar los productos. Intenta de nuevo.';
          this.cargando = false;
          this.mensajeResultados = this.modoBusqueda ? 
            `Error en búsqueda: "${this.terminoBusqueda}"` : 
            'Error al cargar productos';
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga todos los productos
   */
  private cargarTodosLosProductos() {
    this.cargando = true;
    this.error = null;
    // Usar datos del servicio de ejemplo
    const productos = this.productosExampleService.getProductosEjemplo();
    return of(productos);

    // Código comentado: Obtener datos del servicio real
    /*
    return this.productoService.obtenerProductos();
    */
  }

  /**
   * Carga productos por subcategoría
   */
  private cargarProductosPorSubcategoria(subcategoriaId: number) {
    this.cargando = true;
    this.error = null;
    // Usar datos del servicio de ejemplo
    const productos = this.productosExampleService.getProductosPorSubcategoriaId(subcategoriaId);
    return of(productos);

    // Código comentado: Obtener datos del servicio real
    /*
    return this.productoService.obtenerProductosPorSubcategoria(subcategoriaId);
    */
  }

  /**
   * Carga productos por búsqueda de nombre
   */
  private cargarProductosPorBusqueda(termino: string) {
    this.cargando = true;
    this.error = null;
    // Usar datos del servicio de ejemplo
    const todosProductos = this.productosExampleService.getProductosEjemplo();
    const productosFiltrados = todosProductos.filter(producto =>
      producto.nombre.toLowerCase().includes(termino.toLowerCase())
    );
    return of(productosFiltrados);

    // Código comentado: Obtener datos del servicio real
    /*
    return this.productoService.buscarProductosPorNombre(termino);
    */
  }

  /**
   * Actualiza el mensaje de resultados según el contexto
   */
  private actualizarMensajeResultados(): void {
    if (this.modoBusqueda && this.terminoBusqueda.trim()) {
      if (this.productos.length === 0) {
        this.mensajeResultados = `No se encontraron resultados para "${this.terminoBusqueda}"`;
      } else if (this.productos.length === 1) {
        this.mensajeResultados = `1 resultado para "${this.terminoBusqueda}"`;
      } else {
        this.mensajeResultados = `${this.productos.length} resultados para "${this.terminoBusqueda}"`;
      }
    } else {
      this.mensajeResultados = 'Todos los Productos';
    }
  }

  /**
   * Formatea el precio con separadores de miles y símbolo de pesos
   */
  formatearPrecio(precio: any): string {
    try {
      const num = typeof precio === 'string' ? parseFloat(precio) : precio;
      if (isNaN(num)) {
        return '$0';
      }
      const formatted = num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return '$' + formatted;
    } catch (error) {
      console.error('Error formateando precio:', error);
      return '$0';
    }
  }

  /**
   * Navega a la página de detalles del producto
   */
  verDetalles(producto: Producto) {
    console.log('Viendo detalles del producto:', producto);
    this.productoSeleccionadoService.setProducto(producto);
    this.router.navigate(['/producto', producto.id, 'detalle-producto-espumasyplasticos']);
  }

  /**
   * Limpia la búsqueda y muestra todos los productos
   */
  limpiarBusqueda() {
    if (this.modoBusqueda) {
      this.router.navigate(['/productos']);
    }
  }

  /**
   * Obtiene la primera imagen del producto
   */
  getProductoImagen(producto: Producto): string {
    if (producto.imagenes && producto.imagenes.length > 0 && producto.imagenes[0]) {
      return producto.imagenes[0];
    }
    return '';
  }

  /**
   * Maneja errores de carga de imágenes
   */
  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    
    const parent = img.parentElement;
    if (parent) {
      const placeholder = parent.querySelector('.sin-imagen');
      if (!placeholder) {
        const newPlaceholder = document.createElement('div');
        newPlaceholder.className = 'sin-imagen';
        newPlaceholder.innerHTML = `
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="7" width="18" height="13" rx="2" stroke="#cce7e9" stroke-width="2"/>
            <path d="M3 7L12 13L21 7" stroke="#cce7e9" stroke-width="2"/>
          </svg>
        `;
        parent.appendChild(newPlaceholder);
      }
    }
  }
}