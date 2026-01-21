import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductoSeleccionadoService } from '../../../services/productos/producto-seleccionado.service';
import { ProductoService } from '../../../services/productos/producto.service';
import { ProductoDTO } from '../../../models/productos/producto.dto';

@Component({
  selector: 'app-descripcion-seleccionado',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './descripcion-seleccionado.html',
  styleUrl: './descripcion-seleccionado.css'
})
export class DescripcionSeleccionado implements OnInit, OnDestroy {
  producto: ProductoDTO | null = null;
  cargando = true;
  error = false;
  enlaceCopiado = false;
  zoomX = 0;
  zoomY = 0;
  imagenSeleccionadaIndex = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private productoSeleccionadoService: ProductoSeleccionadoService,
    private productoService: ProductoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarProducto();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga el producto desde la ruta o desde el servicio
   */
  private cargarProducto(): void {
    // Primero intentar obtener el ID de la ruta
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const idParam = params.get('id');
        if (idParam) {
          // Cargar desde la API usando el ID de la ruta
          const productoId = parseInt(idParam, 10);
          this.productoService.obtenerProductoPorId(productoId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (producto) => {
                this.producto = producto;
                this.error = false;
                this.cargando = false;
                console.log('✅ Producto cargado desde ruta:', producto);
              },
              error: (err) => {
                console.error('Error cargando producto desde ruta:', err);
                this.error = true;
                this.cargando = false;
              }
            });
        } else {
          // Fallback: cargar desde el servicio (si viene de navegación interna)
          this.productoSeleccionadoService.getProducto()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (producto) => {
                if (producto) {
                  this.producto = producto;
                  this.error = false;
                } else {
                  this.error = true;
                }
                this.cargando = false;
              },
              error: (err) => {
                console.error('Error cargando producto:', err);
                this.error = true;
                this.cargando = false;
              }
            });
        }
      });
  }

  /**
   * Obtiene el nombre completo del producto
   */
  get nombreCompleto(): string {
    if (!this.producto) return '';
    return this.producto.nombre;
  }

  /**
   * Obtiene la primera imagen disponible o una por defecto
   */
  get imagenPrincipal(): string {
    if (!this.producto?.imagenes || this.producto.imagenes.length === 0) {
      return 'assets/img/producto-default.jpg';
    }
    return this.producto.imagenes[this.imagenSeleccionadaIndex];
  }

  /**
   * Formatea el precio en formato colombiano
   */
  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  }

  /**
   * Genera el enlace de WhatsApp con el producto
   */
  generarWhatsAppLink(): string {
    if (!this.producto) return '';

    const mensaje = `Hola, me interesa el producto: ${this.producto.nombre}. Precio: ${this.formatearPrecio(this.producto.precio)}. ¿Podría brindarme más información?`;
    const enlace = `https://api.whatsapp.com/send/?phone=573113416659&text=${encodeURIComponent(mensaje)}&type=phone_number&app_absent=0`;
    return enlace;
  }

  /**
   * Copia el enlace del producto al portapapeles
   */
  copiarEnlace(): void {
    if (!this.producto) return;

    const enlace = `${window.location.origin}/producto/${this.producto.id}`;
    navigator.clipboard.writeText(enlace).then(() => {
      this.enlaceCopiado = true;
      setTimeout(() => {
        this.enlaceCopiado = false;
      }, 3000);
    }).catch(err => {
      console.error('Error al copiar enlace:', err);
    });
  }

  /**
   * Navega de vuelta a la página de productos
   */
  volverAProductos(): void {
    this.router.navigate(['/productos']);
  }

  /**
   * Navega a más productos de la misma categoría
   */
  verMasDeEstaCategoria(): void {
    if (this.producto?.categoria) {
      this.router.navigate(['/productos'], {
        queryParams: { categoria: this.producto.categoria }
      });
    }
  }

  /**
   * Calcula la posición del zoom basada en la posición del cursor
   */
  onImageMouseMove(event: MouseEvent): void {
    const container = event.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    
    // Calcula la posición relativa del cursor (0 a 1)
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    
    // Convierte a porcentaje para la traslación (0% a 100%)
    this.zoomX = x * 100;
    this.zoomY = y * 100;
  }

  /**
   * Reinicia la posición del zoom cuando el cursor sale
   */
  onImageMouseLeave(): void {
    this.zoomX = 50;
    this.zoomY = 50;
  }

  /**
   * Cambia a una imagen diferente
   */
  seleccionarImagen(index: number): void {
    if (this.producto?.imagenes && index >= 0 && index < this.producto.imagenes.length) {
      this.imagenSeleccionadaIndex = index;
    }
  }
}

