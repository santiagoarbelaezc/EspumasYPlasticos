import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, switchMap, catchError, finalize } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { ProductoDTO } from '../../../models/productos/producto.dto';
import { ProductoService } from '../../../services/productos/producto.service';
import { ProductoSeleccionadoService } from '../../../services/productos/producto-seleccionado.service';

@Component({
  selector: 'app-carrusel-relacionados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrusel-relacionados.html',
  styleUrls: ['./carrusel-relacionados.css']
})
export class CarruselRelacionados implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('carouselContainer', { static: false }) carouselContainer!: ElementRef;
  @ViewChild('carouselContent', { static: false }) carouselContent!: ElementRef;
  @ViewChild('carouselTrack', { static: false }) carouselTrack!: ElementRef;

  // Productos relacionados
  productos: ProductoDTO[] = [];
  productoSeleccionado: ProductoDTO | null = null;
  categoriaProducto: string | null = null;
  
  // Control del carrusel
  currentIndex = 0;
  itemsPerView = 5;
  isAnimating = false;
  isDragging = false;
  dragStartX = 0;
  dragCurrentX = 0;
  dragThreshold = 30;
  momentum = 0;
  lastDragTime = 0;
  scrollSpeed = 0.5;
  transitionDuration = 200;
  
  // Estados
  isLoading = false;
  error: string | null = null;
  mensajeEstado: string = 'Cargando productos relacionados...';

  // Configuración
  readonly TOTAL_PRODUCTOS = 15;
  readonly MIN_RELACIONADOS = 8;

  private destroy$ = new Subject<void>();
  private resizeListener: (() => void) | null = null;
  private rafId: number | null = null;
  private lastWheelTime = 0;
  private wheelDelta = 0;

  private productoService = inject(ProductoService);
  private productoSeleccionadoService = inject(ProductoSeleccionadoService);
  private router = inject(Router);

  ngOnInit() {
    console.log('🎠 Iniciando Carrusel Relacionados...');
    
    // Suscribirse al producto seleccionado
    this.productoSeleccionadoService.getProducto()
      .pipe(takeUntil(this.destroy$))
      .subscribe(producto => {
        this.productoSeleccionado = producto;
        if (producto) {
          this.cargarProductosRelacionados(producto);
        } else {
          this.mensajeEstado = 'No hay producto seleccionado.';
          this.productos = [];
          this.error = 'Selecciona un producto para ver relacionados.';
        }
      });

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

  /**
   * Carga productos relacionados basados en el producto seleccionado
   * Estrategia mejorada:
   * 1. Primero intentar obtener productos de la misma categoría
   * 2. Si no hay suficientes, buscar por palabras clave en el nombre
   * 3. Completar con productos aleatorios
   */
  private cargarProductosRelacionados(producto: ProductoDTO) {
    this.isLoading = true;
    this.error = null;
    this.mensajeEstado = 'Buscando productos relacionados...';
    
    // Determinar la categoría del producto
    this.categoriaProducto = producto.categoria || null;
    
    // Obtener todas las categorías disponibles primero para mapear nombre a ID
    // Nota: Necesitarías un servicio para obtener categorías. Si no tienes, 
    // usaremos la estrategia de búsqueda por nombre
    this.obtenerProductosEstrategicos(producto)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          setTimeout(() => this.updateTrackPosition(), 100);
        })
      )
      .subscribe({
        next: (productosRelacionados) => {
          this.productos = productosRelacionados;
          if (this.productos.length > 0) {
            this.mensajeEstado = `${this.productos.length} productos relacionados encontrados`;
            console.log('✅ Productos relacionados cargados:', this.productos.length);
          } else {
            this.mensajeEstado = 'No se encontraron productos relacionados';
            this.error = 'No hay productos relacionados disponibles.';
          }
        },
        error: (err) => {
          console.error('❌ Error al cargar productos relacionados:', err);
          this.error = 'Error al cargar productos relacionados.';
          this.mensajeEstado = 'Error al cargar productos relacionados.';
          this.productos = [];
        }
      });
  }

  /**
   * Estrategia mejorada para obtener productos relacionados
   */
  private obtenerProductosEstrategicos(producto: ProductoDTO) {
    const estrategias = [
      // Estrategia 1: Productos de la misma categoría (si tenemos categoría)
      this.obtenerProductosPorCategoria(producto),
      
      // Estrategia 2: Productos con nombres similares
      this.obtenerProductosPorSimilitud(producto),
      
      // Estrategia 3: Productos aleatorios para completar
      this.obtenerProductosAleatorios(this.TOTAL_PRODUCTOS)
    ];

    return forkJoin(estrategias).pipe(
      switchMap(([productosCategoria, productosSimilares, productosAleatorios]) => {
        return of(this.combinarProductosEstrategicamente(
          producto,
          productosCategoria,
          productosSimilares,
          productosAleatorios
        ));
      }),
      catchError((error) => {
        console.error('Error en estrategias de búsqueda:', error);
        // Si fallan las estrategias complejas, devolver solo aleatorios
        return this.productoService.obtenerProductosAleatorios(this.TOTAL_PRODUCTOS).pipe(
          catchError(() => of([]))
        );
      })
    );
  }

  /**
   * Estrategia 1: Obtener productos por categoría
   */
  private obtenerProductosPorCategoria(producto: ProductoDTO) {
    if (!producto.categoria) {
      return of([]);
    }

    // NOTA: Necesitas implementar un endpoint en tu backend que acepte nombre de categoría
    // Por ahora, obtendremos todos y filtraremos por categoría
    return this.productoService.obtenerProductos().pipe(
      catchError(() => of([])),
      switchMap((todosProductos: ProductoDTO[]) => {
        const productosMismaCategoria = todosProductos.filter(p => 
          p.categoria === producto.categoria && p.id !== producto.id
        );
        
        // Limitar a un máximo para no sobrecargar
        const limitados = productosMismaCategoria.slice(0, this.MIN_RELACIONADOS * 2);
        return of(limitados);
      })
    );
  }

  /**
   * Estrategia 2: Obtener productos por similitud en nombre
   */
  private obtenerProductosPorSimilitud(producto: ProductoDTO) {
    if (!producto.nombre) {
      return of([]);
    }

    // Extraer palabras clave del nombre del producto
    const palabrasClave = this.extraerPalabrasClave(producto.nombre);
    
    if (palabrasClave.length === 0) {
      return of([]);
    }

    // Buscar productos con cada palabra clave
    const busquedas = palabrasClave.map(palabra =>
      this.productoService.buscarProductosPorNombre(palabra).pipe(
        catchError(() => of([]))
      )
    );

    if (busquedas.length === 0) {
      return of([]);
    }

    return forkJoin(busquedas).pipe(
      switchMap((resultados: ProductoDTO[][]) => {
        // Combinar todos los resultados y eliminar duplicados
        const todosProductos = resultados.flat();
        const productosUnicos = this.eliminarDuplicados(todosProductos, producto.id);
        
        // Limitar resultados
        return of(productosUnicos.slice(0, this.MIN_RELACIONADOS));
      }),
      catchError(() => of([]))
    );
  }

  /**
   * Estrategia 3: Obtener productos aleatorios
   */
  private obtenerProductosAleatorios(cantidad: number) {
    return this.productoService.obtenerProductosAleatorios(cantidad).pipe(
      catchError(() => of([]))
    );
  }

  /**
   * Extrae palabras clave del nombre del producto
   */
  private extraerPalabrasClave(nombre: string): string[] {
    const palabrasComunes = ['de', 'y', 'o', 'la', 'el', 'un', 'una', 'para', 'con', 'en', 'por', 'sin'];
    const palabras = nombre.toLowerCase()
      .split(/[\s\-_,;]+/)
      .filter(palabra => 
        palabra.length > 2 && 
        !palabrasComunes.includes(palabra) &&
        !/\d/.test(palabra) // Excluir números puros
      )
      .slice(0, 3); // Tomar máximo 3 palabras clave
    
    return [...new Set(palabras)]; // Eliminar duplicados
  }

  /**
   * Combina productos de diferentes estrategias de manera inteligente
   */
  private combinarProductosEstrategicamente(
    productoBase: ProductoDTO,
    productosCategoria: ProductoDTO[],
    productosSimilares: ProductoDTO[],
    productosAleatorios: ProductoDTO[]
  ): ProductoDTO[] {
    const productosFiltrados: ProductoDTO[] = [];
    const idsUsados = new Set<number>();
    
    // Agregar el ID del producto base para excluirlo
    idsUsados.add(productoBase.id);
    
    // Función auxiliar para agregar productos
    const agregarProductos = (productos: ProductoDTO[], maxCantidad: number) => {
      const disponibles = productos.filter(p => !idsUsados.has(p.id));
      const aAgregar = disponibles.slice(0, maxCantidad);
      
      aAgregar.forEach(p => {
        productosFiltrados.push(p);
        idsUsados.add(p.id);
      });
      
      return aAgregar.length;
    };
    
    // Prioridad 1: Productos de la misma categoría (más relevantes)
    let agregadosCategoria = agregarProductos(productosCategoria, this.MIN_RELACIONADOS);
    
    // Prioridad 2: Productos con nombres similares
    let agregadosSimilares = 0;
    if (productosFiltrados.length < this.MIN_RELACIONADOS) {
      const slotsRestantes = this.MIN_RELACIONADOS - productosFiltrados.length;
      agregadosSimilares = agregarProductos(productosSimilares, slotsRestantes);
    }
    
    // Prioridad 3: Productos aleatorios para completar
    if (productosFiltrados.length < this.TOTAL_PRODUCTOS) {
      const slotsFinales = this.TOTAL_PRODUCTOS - productosFiltrados.length;
      agregarProductos(productosAleatorios, slotsFinales);
    }
    
    console.log(`📊 Estrategia completada:`, {
      categoria: agregadosCategoria,
      similares: agregadosSimilares,
      aleatorios: productosFiltrados.length - agregadosCategoria - agregadosSimilares,
      total: productosFiltrados.length
    });
    
    // Mezclar ligeramente pero mantener cierta agrupación por relevancia
    return this.mezclarInteligente(productosFiltrados, agregadosCategoria, agregadosSimilares);
  }

  /**
   * Mezcla productos de manera inteligente
   * Mantiene algunos productos relacionados juntos pero evita patrones predecibles
   */
  private mezclarInteligente(
    productos: ProductoDTO[], 
    cantidadCategoria: number, 
    cantidadSimilares: number
  ): ProductoDTO[] {
    if (productos.length <= 1) return productos;
    
    const mezclados = [...productos];
    
    // Solo mezclar si tenemos suficientes productos
    if (mezclados.length > 3) {
      // Mantener el primer producto de categoría al inicio
      // Mezclar el resto
      for (let i = 1; i < mezclados.length; i++) {
        const j = Math.floor(Math.random() * (mezclados.length - 1)) + 1;
        [mezclados[i], mezclados[j]] = [mezclados[j], mezclados[i]];
      }
    }
    
    return mezclados;
  }

  /**
   * Elimina productos duplicados por ID
   */
  private eliminarDuplicados(productos: ProductoDTO[], excluirId: number): ProductoDTO[] {
    const unicos = new Map<number, ProductoDTO>();
    
    productos.forEach(producto => {
      if (producto.id !== excluirId && !unicos.has(producto.id)) {
        unicos.set(producto.id, producto);
      }
    });
    
    return Array.from(unicos.values());
  }

  // Métodos del carrusel (igual que en CarruselFull)
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    requestAnimationFrame(() => {
      this.updateItemsPerView();
      this.updateTrackPosition();
    });
  }

  onWheel(event: WheelEvent) {
    if (this.productos.length <= this.itemsPerView || this.isAnimating) return;
    
    const isMobile = window.innerWidth <= 768;
    const absDeltaX = Math.abs(event.deltaX);
    const absDeltaY = Math.abs(event.deltaY);
    const horizontalThreshold = isMobile ? 15 : 5;
    const isScrollingHorizontally = absDeltaX > absDeltaY && absDeltaX > horizontalThreshold;
    
    if (!isScrollingHorizontally) return;
    
    event.preventDefault();
    
    const now = Date.now();
    const timeDiff = now - this.lastWheelTime;
    
    if (timeDiff < 100) {
      this.wheelDelta += event.deltaX;
    } else {
      this.wheelDelta = event.deltaX;
    }
    
    this.lastWheelTime = now;
    
    const direction = this.wheelDelta > 0 ? 1 : -1;
    const moveThreshold = isMobile ? 8 : 10;
    
    if (Math.abs(this.wheelDelta) > moveThreshold) {
      this.move(direction);
      this.wheelDelta = 0;
    }
    
    if (this.rafId) cancelAnimationFrame(this.rafId);
    
    this.rafId = requestAnimationFrame(() => {
      this.wheelDelta *= 0.8;
      if (Math.abs(this.wheelDelta) < 0.1) {
        this.wheelDelta = 0;
      }
    });
  }

  startDrag(event: MouseEvent | TouchEvent) {
    if (this.isAnimating) return;
    if ('button' in event && event.button !== 0) return;
    
    this.isDragging = true;
    this.momentum = 0;
    this.lastDragTime = Date.now();
    
    const clientX = this.getClientX(event);
    this.dragStartX = clientX;
    this.dragCurrentX = clientX;
    
    if (this.carouselTrack?.nativeElement) {
      this.carouselTrack.nativeElement.style.transition = 'none';
    }
    
    if ('touches' in event) {
      event.preventDefault();
    }
  }

  onDrag(event: MouseEvent | TouchEvent) {
    if (!this.isDragging || this.isAnimating) return;
    
    const now = Date.now();
    const timeDiff = now - this.lastDragTime;
    this.lastDragTime = now;
    
    const clientX = this.getClientX(event);
    const delta = clientX - this.dragCurrentX;
    
    if (timeDiff > 0) {
      this.momentum = delta / timeDiff;
    }
    
    this.dragCurrentX = clientX;
    this.updateTrackPosition();
    
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(() => {});
  }

  endDrag(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    
    if (this.carouselTrack?.nativeElement) {
      this.carouselTrack.nativeElement.style.transition = `transform ${this.transitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    }
    
    const diff = this.dragStartX - this.dragCurrentX;
    const absDiff = Math.abs(diff);
    const isMobile = window.innerWidth <= 768;
    const effectiveThreshold = isMobile ? 20 : this.dragThreshold;
    
    if (Math.abs(this.momentum) > 0.08 && absDiff > 15) {
      const direction = this.momentum > 0 ? -1 : 1;
      const momentumSteps = Math.min(Math.floor(Math.abs(this.momentum) * 80), isMobile ? 2 : 3);
      
      for (let i = 0; i < momentumSteps; i++) {
        setTimeout(() => {
          this.move(direction);
        }, i * 50);
      }
    } else if (absDiff > effectiveThreshold) {
      const direction = diff > 0 ? -1 : 1;
      this.move(direction);
    } else {
      this.updateTrackPosition();
    }
  }

  private getClientX(event: MouseEvent | TouchEvent): number {
    if ('touches' in event && event.touches.length > 0) {
      return event.touches[0].clientX;
    }
    return (event as MouseEvent).clientX;
  }

  move(direction: number): void {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    const newIndex = this.currentIndex + direction;
    
    if (newIndex < 0 || newIndex > this.productos.length - this.itemsPerView) {
      this.isAnimating = false;
      return;
    }
    
    this.currentIndex = newIndex;
    this.updateTrackPosition();
    
    setTimeout(() => {
      this.isAnimating = false;
    }, this.transitionDuration);
  }

  updateItemsPerView() {
    const width = window.innerWidth;
    let newItemsPerView = 5;
    
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

  updateTrackPosition() {
    if (!this.carouselTrack?.nativeElement || this.productos.length === 0) return;
    
    const track = this.carouselTrack.nativeElement;
    
    if (this.productos.length <= this.itemsPerView) {
      const totalCardsWidth = this.productos.length * 100;
      const containerWidth = this.itemsPerView * 100;
      const offset = (containerWidth - totalCardsWidth) / (2 * this.itemsPerView);
      track.style.transform = `translateX(${offset}%)`;
    } else if (this.isDragging) {
      const diff = this.dragStartX - this.dragCurrentX;
      const trackWidth = track.scrollWidth;
      const contentWidth = this.carouselContent?.nativeElement?.clientWidth || trackWidth;
      const dragPercent = (diff / contentWidth) * 100;
      const baseTranslate = -(this.currentIndex * (100 / this.itemsPerView));
      track.style.transform = `translateX(${baseTranslate + dragPercent}%)`;
    } else {
      const translateX = -(this.currentIndex * (100 / this.itemsPerView));
      track.style.transform = `translateX(${translateX}%)`;
    }
  }

  getProgressDots(): { index: number; active: boolean }[] {
    const dots: { index: number; active: boolean }[] = [];
    const totalVisible = this.itemsPerView;
    const total = this.productos.length;
    
    if (total <= totalVisible) {
      return [{ index: 0, active: true }];
    }
    
    const maxIndex = total - totalVisible;
    const isMobile = this.itemsPerView <= 3;
    const maxDots = isMobile ? 4 : 8;
    const step = Math.max(1, Math.ceil(maxIndex / maxDots));
    
    dots.push({ index: 0, active: false });
    
    for (let i = step; i < maxIndex; i += step) {
      dots.push({ index: i, active: false });
    }
    
    if (dots[dots.length - 1].index !== maxIndex) {
      dots.push({ index: maxIndex, active: false });
    }
    
    for (let i = 0; i < dots.length; i++) {
      const currentDotIndex = dots[i].index;
      const nextDotIndex = i < dots.length - 1 ? dots[i + 1].index : maxIndex + 1;
      
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

  // Métodos utilitarios
  formatearPrecio(precio: any): string {
    try {
      const num = typeof precio === 'string' ? parseFloat(precio) : precio;
      if (isNaN(num)) {
        return '$0';
      }
      const formatted = num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return '$' + formatted;
    } catch (error) {
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

  // Métodos de interacción
  selectProduct(producto: ProductoDTO) {
    console.log('Producto relacionado seleccionado:', producto);
    this.productoSeleccionadoService.setProducto(producto);
    this.router.navigate(['/producto', producto.id, 'detalle-producto-espumasyplasticos']);
  }

  addToCart(producto: ProductoDTO, event: Event) {
    event.stopPropagation();
    console.log('Añadir al carrito producto relacionado:', producto);
    // Lógica para añadir al carrito
  }

  viewDetails(producto: ProductoDTO, event: Event) {
    event.stopPropagation();
    console.log('Ver detalles producto relacionado:', producto);
    this.productoSeleccionadoService.setProducto(producto);
    this.router.navigate(['/producto', producto.id, 'detalle-producto-espumasyplasticos']);
  }

  reintentar() {
    console.log('Reintentando cargar productos relacionados...');
    if (this.productoSeleccionado) {
      this.cargarProductosRelacionados(this.productoSeleccionado);
    }
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
}