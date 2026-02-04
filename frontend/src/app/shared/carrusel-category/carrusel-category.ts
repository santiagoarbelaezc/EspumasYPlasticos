import { Component, Input, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductoSeleccionadoService } from '../../services/productos/producto-seleccionado.service';
import { ProductoService } from '../../services/productos/producto.service';
import { ProductosExampleService } from '../../services/productos.example';
import { CategoriasExampleService } from '../../services/categorias.example';
import { ProductoDTO } from '../../models/productos/producto.dto';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-carrusel-category',
  templateUrl: './carrusel-category.html',
  styleUrls: ['./carrusel-category.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CarruselCategoryComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() categoriaId!: number;
  @Input() titulo: string = 'Productos de la categoría';
  @Input() subtitulo?: string = '';

  productos: ProductoDTO[] = [];
  isLoading = false;
  error: string | null = null;

  @ViewChild('carouselContainer', { static: false }) carouselContainer!: ElementRef;
  @ViewChild('carouselContent', { static: false }) carouselContent!: ElementRef;
  @ViewChild('carouselTrack', { static: false }) carouselTrack!: ElementRef;

  // Control del carrusel
  currentIndex = 0;
  itemsPerView = 5;
  isAnimating = false;
  isDragging = false;
  dragStartX = 0;
  dragCurrentX = 0;
  dragThreshold = 30; // Umbral más bajo para mejor respuesta
  momentum = 0;
  lastDragTime = 0;
  
  // Control de velocidad y suavidad
  scrollSpeed = 0.5; // Velocidad de scroll (0-1)
  transitionDuration = 200; // Duración de transición en ms

  private destroy$ = new Subject<void>();
  private resizeListener: (() => void) | null = null;
  private rafId: number | null = null;
  private lastWheelTime = 0;
  private wheelDelta = 0;

  constructor(
    private productoService: ProductoService,
    private productosExampleService: ProductosExampleService,
    private categoriasExampleService: CategoriasExampleService,
    private router: Router,
    private productoSeleccionadoService: ProductoSeleccionadoService
  ) {}

  ngOnInit() {
    console.log('🎠 Iniciando Carrusel Category...');
    
    this.cargarProductosPorCategoria(this.categoriaId);
    this.updateItemsPerView();
    this.resizeListener = () => {
      requestAnimationFrame(() => {
        this.updateItemsPerView();
        this.updateTrackPosition();
      });
    };
    window.addEventListener('resize', this.resizeListener);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateItemsPerView();
      this.updateTrackPosition();
    }, 100);
  }

  ngOnDestroy() {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarProductosPorCategoria(categoriaId: number) {
    this.isLoading = true;
    this.error = null;
    
    // Código comentado: Obtener datos del servicio real
    /*
    this.productoService.obtenerProductosPorCategoria(categoriaId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (productos) => {
          this.productos = productos;
          this.currentIndex = 0; // Resetear a la primera página
          this.isLoading = false;
          console.log('✅ Productos del carrusel cargados:', this.productos.length);
          setTimeout(() => {
            this.updateTrackPosition();
          }, 100);
        },
        error: (err) => {
          console.error('❌ Error al cargar productos:', err);
          this.error = 'Error al cargar los productos.';
          this.isLoading = false;
        }
      });
    */

    // Usar datos del servicio de ejemplo
    const categoria = this.categoriasExampleService.getCategoriaPorId(categoriaId);
    const categoriaNombre = categoria ? categoria.nombre : '';
    const productos = categoriaNombre 
      ? this.productosExampleService.getProductosPorCategoria(categoriaNombre)
      : this.productosExampleService.getProductosEjemplo();
    this.productos = productos;
    this.currentIndex = 0; // Resetear a la primera página
    this.isLoading = false;
    console.log('✅ Productos del carrusel cargados desde ejemplo:', this.productos.length);
    setTimeout(() => {
      this.updateTrackPosition();
    }, 100);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    requestAnimationFrame(() => {
      this.updateItemsPerView();
      this.updateTrackPosition();
    });
  }

  // Scroll horizontal suave con rueda del mouse (igual que el segundo código)
  onWheel(event: WheelEvent) {
    if (this.productos.length <= this.itemsPerView || this.isAnimating) return;
    
    const isMobile = window.innerWidth <= 768;
    
    // Deshabilitar wheel scroll en móvil - solo flechas
    if (isMobile) return;
    
    // En móvil, solo responder a scroll muy horizontal (trackpad)
    // Permitir scroll vertical normal de la página
    const absDeltaX = Math.abs(event.deltaX);
    const absDeltaY = Math.abs(event.deltaY);
    
    // Umbral más alto en móvil para evitar activación accidental
    const horizontalThreshold = isMobile ? 15 : 5;
    const isScrollingHorizontally = absDeltaX > absDeltaY && absDeltaX > horizontalThreshold;
    
    if (!isScrollingHorizontally) {
      // Si es scroll vertical, permitir scroll normal de la página
      return;
    }
    
    event.preventDefault();
    
    const now = Date.now();
    const timeDiff = now - this.lastWheelTime;
    
    // Acumular delta solo en ventanas cortas de tiempo
    if (timeDiff < 100) {
      this.wheelDelta += event.deltaX;
    } else {
      this.wheelDelta = event.deltaX;
    }
    
    this.lastWheelTime = now;
    
    // Determinar dirección
    const direction = this.wheelDelta > 0 ? 1 : -1;
    
    // Umbral adaptativo: más bajo en móvil
    const moveThreshold = isMobile ? 8 : 10;
    
    // Mover un elemento a la vez
    if (Math.abs(this.wheelDelta) > moveThreshold) {
      this.move(direction);
      this.wheelDelta = 0;
    }
    
    // Usar requestAnimationFrame para scroll suave
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    
    this.rafId = requestAnimationFrame(() => {
      this.wheelDelta *= 0.8; // Decaimiento
      if (Math.abs(this.wheelDelta) < 0.1) {
        this.wheelDelta = 0;
      }
    });
  }

  // Drag & Drop mejorado con momentum (igual que el segundo código)
  startDrag(event: MouseEvent | TouchEvent) {
    if (this.isAnimating) return;
    
    // Deshabilitar drag en móvil - solo flechas
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;
    
    // Solo responder a mouse left button o touch
    if ('button' in event && event.button !== 0) return;
    
    this.isDragging = true;
    this.momentum = 0;
    this.lastDragTime = Date.now();
    
    const clientX = this.getClientX(event);
    this.dragStartX = clientX;
    this.dragCurrentX = clientX;
    
    // Remover transiciones durante el drag
    if (this.carouselTrack?.nativeElement) {
      this.carouselTrack.nativeElement.style.transition = 'none';
    }
    
    // Prevenir comportamiento por defecto en touch
    if ('touches' in event) {
      event.preventDefault();
    }
  }

  onDrag(event: MouseEvent | TouchEvent) {
    if (!this.isDragging || this.isAnimating) return;
    
    // Deshabilitar drag en móvil - solo flechas
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;
    
    const now = Date.now();
    const timeDiff = now - this.lastDragTime;
    this.lastDragTime = now;
    
    const clientX = this.getClientX(event);
    const delta = clientX - this.dragCurrentX;
    
    // Calcular momentum
    if (timeDiff > 0) {
      const velocity = delta / timeDiff;
      this.momentum = velocity * 0.8; // Factor de amortiguación
    }
    
    this.dragCurrentX = clientX;
    
    // Actualizar posición del track en tiempo real
    this.updateTrackPosition();
    
    // Solicitar el siguiente frame para animación continua
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    this.rafId = requestAnimationFrame(() => {});
  }

  endDrag(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    
    // Deshabilitar drag en móvil - solo flechas
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;
    
    this.isDragging = false;
    
    // Restaurar transiciones (igual que el segundo código)
    if (this.carouselTrack?.nativeElement) {
      this.carouselTrack.nativeElement.style.transition = `transform ${this.transitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    }
    
    const diff = this.dragStartX - this.dragCurrentX;
    const absDiff = Math.abs(diff);
    
    // Adaptativo: umbral más bajo en móvil (igual que el segundo código)
    const effectiveThreshold = isMobile ? 20 : this.dragThreshold;
    
    // Aplicar momentum si hay suficiente velocidad (igual que el segundo código)
    if (Math.abs(this.momentum) > 0.08 && absDiff > 15) {
      const direction = this.momentum > 0 ? -1 : 1;
      const momentumSteps = Math.min(Math.floor(Math.abs(this.momentum) * 80), isMobile ? 2 : 3);
      
      for (let i = 0; i < momentumSteps; i++) {
        setTimeout(() => {
          this.move(direction);
        }, i * 50);
      }
    } else if (absDiff > effectiveThreshold) {
      // Movimiento normal por umbral
      const direction = diff > 0 ? -1 : 1;
      this.move(direction);
    } else {
      // Volver a la posición actual
      this.updateTrackPosition();
    }
  }

  // Obtener coordenada X del evento (compatible con mouse y touch)
  private getClientX(event: MouseEvent | TouchEvent): number {
    if ('touches' in event && event.touches.length > 0) {
      return event.touches[0].clientX;
    }
    return (event as MouseEvent).clientX;
  }

  // Movimiento básico de un elemento
  move(direction: number): void {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    
    // Calcular nuevo índice (un elemento a la vez)
    const newIndex = this.currentIndex + direction;
    
    // Validar límites
    if (newIndex < 0 || newIndex > this.productos.length - this.itemsPerView) {
      this.isAnimating = false;
      return;
    }
    
    this.currentIndex = newIndex;
    
    // Actualizar posición con animación
    this.updateTrackPosition();
    
    // Fin de animación
    setTimeout(() => {
      this.isAnimating = false;
    }, this.transitionDuration);
  }

  updateItemsPerView() {
    const width = window.innerWidth;
    let newItemsPerView = 5;
    
    // Actualizado para coincidir con el segundo código
    if (width >= 1400) {
      newItemsPerView = 5;
    } else if (width >= 1200) {
      newItemsPerView = 5;
    } else if (width >= 992) {
      newItemsPerView = 4;
    } else if (width >= 768) {
      newItemsPerView = 3;
    } else if (width >= 480) {
      newItemsPerView = 2;
    } else {
      newItemsPerView = 2;
    }
    
    if (newItemsPerView !== this.itemsPerView) {
      this.itemsPerView = newItemsPerView;
      
      // Ajustar índice actual si es necesario (igual que el segundo código)
      if (this.currentIndex > this.productos.length - this.itemsPerView) {
        this.currentIndex = Math.max(0, this.productos.length - this.itemsPerView);
      }
      
      console.log(`📐 Items por vista actualizado a: ${this.itemsPerView} (ancho: ${width}px)`);
    }
  }

  get isPrevDisabled(): boolean {
    return this.currentIndex === 0 || this.productos.length <= this.itemsPerView;
  }

  get isNextDisabled(): boolean {
    return this.currentIndex >= this.productos.length - this.itemsPerView;
  }

  anterior() {
    this.move(-1);
  }

  siguiente() {
    this.move(1);
  }

  // Actualizado para coincidir con el segundo código
  updateTrackPosition() {
    if (!this.carouselTrack?.nativeElement || this.productos.length === 0) return;
    
    const track = this.carouselTrack.nativeElement;
    
    if (this.productos.length <= this.itemsPerView) {
      // Centrar si hay pocos elementos (igual que el segundo código)
      const totalCardsWidth = this.productos.length * 100;
      const containerWidth = this.itemsPerView * 100;
      const offset = (containerWidth - totalCardsWidth) / (2 * this.itemsPerView);
      track.style.transform = `translateX(${offset}%)`;
    } else if (this.isDragging) {
      // Posición durante el drag (igual que el segundo código)
      const diff = this.dragStartX - this.dragCurrentX;
      const trackWidth = track.scrollWidth;
      const contentWidth = this.carouselContent?.nativeElement?.clientWidth || trackWidth;
      const dragPercent = (diff / contentWidth) * 100;
      const baseTranslate = -(this.currentIndex * (100 / this.itemsPerView));
      track.style.transform = `translateX(${baseTranslate + dragPercent}%)`;
    } else {
      // Posición normal
      const translateX = -(this.currentIndex * (100 / this.itemsPerView));
      track.style.transform = `translateX(${translateX}%)`;
    }
  }

  // Método para obtener la transformación (igual que el segundo código)
  getTrackTransform(): string {
    if (this.productos.length <= this.itemsPerView) {
      const totalCardsWidth = this.productos.length * 100;
      const containerWidth = this.itemsPerView * 100;
      const offset = (containerWidth - totalCardsWidth) / (2 * this.itemsPerView);
      return `translateX(${offset}%)`;
    }
    
    const translateX = -(this.currentIndex * (100 / this.itemsPerView));
    return `translateX(${translateX}%)`;
  }

  // Métodos para navegación por puntos (actualizado para coincidir)
  getProgressDots(): { index: number; active: boolean }[] {
    const dots: { index: number; active: boolean }[] = [];
    const totalVisible = this.itemsPerView;
    const total = this.productos.length;
    
    if (total <= totalVisible) {
      return [{ index: 0, active: true }];
    }
    
    const maxIndex = total - totalVisible;
    
    // Detectar si estamos en móvil (2-3 items por vista)
    const isMobile = this.itemsPerView <= 3;
    
    // En móvil máximo 4 puntos, en desktop máximo 8
    const maxDots = isMobile ? 4 : 8;
    
    // Calcular el paso entre puntos
    const step = Math.max(1, Math.ceil(maxIndex / maxDots));
    
    // Siempre incluir el primer punto
    dots.push({
      index: 0,
      active: false
    });
    
    // Incluir puntos intermedios
    for (let i = step; i < maxIndex; i += step) {
      dots.push({
        index: i,
        active: false
      });
    }
    
    // Siempre incluir el último punto (si no está ya)
    if (dots[dots.length - 1].index !== maxIndex) {
      dots.push({
        index: maxIndex,
        active: false
      });
    }
    
    // Determinar cuál punto debe estar activo
    // Encontrar el punto cuyo rango contiene el currentIndex
    for (let i = 0; i < dots.length; i++) {
      const currentDotIndex = dots[i].index;
      const nextDotIndex = i < dots.length - 1 ? dots[i + 1].index : maxIndex + 1;
      
      // Si el currentIndex está entre este punto y el siguiente
      if (this.currentIndex >= currentDotIndex && this.currentIndex < nextDotIndex) {
        dots[i].active = true;
        break;
      }
    }
    
    return dots;
  }

  goToDotSlide(index: number) {
    if (this.isAnimating || this.currentIndex === index) return;
    
    this.isAnimating = true;
    this.currentIndex = index;
    
    // Validar límites
    if (this.currentIndex > this.productos.length - this.itemsPerView) {
      this.currentIndex = this.productos.length - this.itemsPerView;
    }
    
    this.updateTrackPosition();
    
    setTimeout(() => {
      this.isAnimating = false;
    }, this.transitionDuration);
  }

  getProgressBarWidth(): string {
    if (this.productos.length <= this.itemsPerView) {
      return '100%';
    }
    
    const maxIndex = this.productos.length - this.itemsPerView;
    const progress = (this.currentIndex / maxIndex) * 100;
    return `${progress}%`;
  }

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

  getProductoImagen(producto: ProductoDTO): string {
    if (producto.imagenes && producto.imagenes.length > 0 && producto.imagenes[0]) {
      return producto.imagenes[0];
    }
    return '';
  }

  getStars(rating: number): boolean[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      stars.push(i < fullStars);
    }
    
    return stars;
  }

  reintentar() {
    console.log('Reintentando cargar productos...');
    this.cargarProductosPorCategoria(this.categoriaId);
  }

  exploreMore() {
    console.log('Explorando más productos...');
    // Implementar navegación a otra sección si es necesario
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    
    const parent = img.parentElement;
    if (parent) {
      const placeholder = parent.querySelector('.sin-imagen');
      if (!placeholder) {
        const newPlaceholder = document.createElement('div');
        newPlaceholder.className = 'sin-imagen';
        parent.appendChild(newPlaceholder);
      }
    }
  }

  // Métodos adicionales para las acciones de los botones
  addToCart(producto: ProductoDTO, event: Event) {
    event.stopPropagation();
    console.log('Añadir al carrito:', producto);
    // Lógica para añadir al carrito
  }

  viewDetails(producto: ProductoDTO, event: Event) {
    event.stopPropagation();
    console.log('Ver detalles:', producto);
    this.productoSeleccionadoService.setProducto(producto);
    this.router.navigate(['/producto', producto.id, 'detalle-producto-espumasyplasticos']);
  }

  // Método para manejar clic en la tarjeta
  selectProduct(producto: ProductoDTO) {
    console.log('Producto seleccionado:', producto);
    this.productoSeleccionadoService.setProducto(producto);
    this.router.navigate(['/producto', producto.id, 'detalle-producto-espumasyplasticos']);
  }

  // Método para debugging (igual que el segundo código)
  debugInfo(): void {
    console.log('=== DEBUG CARRUSEL ===');
    console.log('Productos totales:', this.productos.length);
    console.log('Items por vista:', this.itemsPerView);
    console.log('Current Index:', this.currentIndex);
    console.log('isPrevDisabled:', this.isPrevDisabled);
    console.log('isNextDisabled:', this.isNextDisabled);
    console.log('isAnimating:', this.isAnimating);
    console.log('=====================');
  }
}