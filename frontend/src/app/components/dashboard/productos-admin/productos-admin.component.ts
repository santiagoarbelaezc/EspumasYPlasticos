import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProductoDTO } from '../../../models/productos/producto.dto';
import { SubcategoriaDTO } from '../../../models/subcategorias/subcategoria.dto';
import { CategoriaDTO } from '../../../models/categorias/categoria.dto';
import { ProductoService } from '../../../services/productos/producto.service';
import { SubcategoriaService } from '../../../services/subcategorias/subcategoria.service';
import { CategoriaService } from '../../../services/categorias/categoria.service';
import { AlertService } from '../../../services/alert.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faSearch, 
  faRotate, 
  faTrash, 
  faArrowLeft, 
  faImage, 
  faCheck, 
  faPlus, 
  faTimes, 
  faCircle 
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-productos-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './productos-admin.component.html',
  styleUrls: ['./productos-admin.component.css']
})
export class ProductosAdminComponent implements OnInit {
  productos: ProductoDTO[] = [];
  subcategorias: SubcategoriaDTO[] = [];
  formProducto!: FormGroup;
  imagenesSeleccionadas: File[] = [];
  previewUrls: string[] = [];
  editando = false;
  productoActualId?: number;
  categorias: CategoriaDTO[] = [];

  // 🎨 Iconos
  faSearch = faSearch;
  faRotate = faRotate;
  faTrash = faTrash;
  faArrowLeft = faArrowLeft;
  faImage = faImage;
  faCheck = faCheck;
  faPlus = faPlus;
  faTimes = faTimes;
  faCircle = faCircle;

  // 🔍 Filtros
  filtersForm!: FormGroup;

  // 📄 Paginación
  currentPage = 1;
  pageSize = 10;
  totalProducts = 0;
  paginatedProducts: ProductoDTO[] = [];

  // Exposer Math para templates
  Math = Math;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private subcategoriaService: SubcategoriaService,
    private categoriaService: CategoriaService,
    private alert: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formProducto = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(0), this.noNegativeValidator.bind(this)]],
      precio: ['', [Validators.required, Validators.min(0), this.noNegativeValidator.bind(this)]],
      subcategoria_id: ['', Validators.required]
    });

    this.filtersForm = this.fb.group({
      nombre: [''],
      categoria_id: [''],
      subcategoria_id: [''],
      min_precio: [''],
      max_precio: ['']
    });

    this.filtersForm.valueChanges.subscribe(() => {
      this.cargarProductos();
    });

    this.cargarCategoriasDashboard();
    this.cargarSubcategorias();
    this.cargarProductos();
  }

  volverAlDashboard(): void {
    this.router.navigate(['/admin']);
  }

  cargarCategoriasDashboard(): void {
    this.categoriaService.obtenerCategorias().subscribe({
      next: res => this.categorias = res,
      error: err => this.alert.mostrarError('Error al cargar categorías.')
    });
  }

  cargarSubcategorias(): void {
    const filters = this.filtersForm?.value;
    const catId = filters?.categoria_id;
    
    // Si hay una categoría seleccionada en el filtro, traemos solo sus subcategorías para el filtro
    // Pero el select del formulario de creación/edición necesita todas. 
    // Para simplificar, traeremos todas por ahora, o podríamos filtrar dinámicamente.
    this.subcategoriaService.obtenerSubcategorias().subscribe({
      next: res => this.subcategorias = res,
      error: err => this.alert.mostrarError('Error al cargar subcategorías.')
    });
  }

  cargarProductos(): void {
    const filtros = this.filtersForm?.value;
    this.productoService.obtenerProductos(filtros).subscribe({
      next: res => {
        this.productos = res;
        this.totalProducts = res.length;
        this.currentPage = 1;
        this.actualizarPaginacion();
      },
      error: err => this.alert.mostrarError('Error al cargar productos.')
    });
  }

  actualizarPaginacion(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.productos.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.totalProducts / this.pageSize);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.currentPage = pagina;
      this.actualizarPaginacion();
    }
  }

  irAPaginaAnterior(): void {
    if (this.currentPage > 1) {
      this.cambiarPagina(this.currentPage - 1);
    }
  }

  irAPaginaSiguiente(): void {
    if (this.currentPage < this.totalPages) {
      this.cambiarPagina(this.currentPage + 1);
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.imagenesSeleccionadas = Array.from(input.files).slice(0, 5);
    this.previewUrls = [];

    this.imagenesSeleccionadas.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrls.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  guardarProducto(): void {
    if (this.formProducto.invalid) {
      this.alert.mostrarError('Complete todos los campos obligatorios.', 'Campos incompletos');
      return;
    }

    if (!this.editando && this.imagenesSeleccionadas.length === 0) {
      this.alert.mostrarError('Debes subir al menos una imagen para crear un producto.', 'Sin imágenes');
      return;
    }

    const { nombre, descripcion, cantidad, precio, subcategoria_id } = this.formProducto.value;

    if (this.editando && this.productoActualId !== undefined) {
      this.productoService.actualizarProducto(
        this.productoActualId,
        nombre,
        descripcion,
        cantidad,
        precio,
        subcategoria_id,
        this.imagenesSeleccionadas.length > 0 ? this.imagenesSeleccionadas : undefined
      ).subscribe({
        next: () => {
          this.alert.mostrarExito('Producto actualizado correctamente');
          this.resetFormulario();
          this.cargarProductos();
        },
        error: err => {
          console.error('Error al actualizar producto:', err);
          this.alert.mostrarError('No se pudo actualizar el producto.');
        }
      });
    } else {
      this.productoService.crearProducto(
        nombre,
        descripcion,
        cantidad,
        precio,
        subcategoria_id,
        this.imagenesSeleccionadas
      ).subscribe({
        next: () => {
          this.alert.mostrarExito('Producto creado correctamente');
          this.resetFormulario();
          this.cargarProductos();
        },
        error: err => {
          console.error('Error al crear producto:', err);
          this.alert.mostrarError('No se pudo crear el producto.');
        }
      });
    }
  }

  seleccionar(producto: ProductoDTO): void {
    this.editando = true;
    this.productoActualId = producto.id;
    this.formProducto.patchValue({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      cantidad: producto.cantidad,
      precio: producto.precio,
      subcategoria_id: producto.subcategoria_id
    });
    this.previewUrls = producto.imagenes || [];
    this.imagenesSeleccionadas = [];
  }

  cancelarEdicion(): void {
    this.resetFormulario();
  }

  eliminar(id: number): void {
    this.alert.confirmarEliminacion().then(result => {
      if (result.isConfirmed) {
        this.productoService.eliminarProducto(id).subscribe({
          next: () => {
            this.alert.mostrarExito('Producto eliminado correctamente');
            this.cargarProductos();
          },
          error: err => {
            console.error('Error al eliminar producto:', err);
            this.alert.mostrarError('No se pudo eliminar el producto.');
          }
        });
      }
    });
  }

  obtenerNombreSubcategoria(subcategoriaId: number): string {
    const subcategoria = this.subcategorias.find(s => s.id === subcategoriaId);
    return subcategoria?.nombre || 'Sin subcategoría';
  }

  formatearPrecio(precio: any): string {
    const numPrecio = typeof precio === 'string' ? parseFloat(precio) : precio;
    return isNaN(numPrecio) ? '0.00' : numPrecio.toFixed(2);
  }

  formatearPrecioConSeparador(precio: any): string {
    const numPrecio = typeof precio === 'string' ? parseFloat(precio) : precio;
    if (isNaN(numPrecio)) return '0';
    
    // Convertir a número entero para mostrar con separadores de miles
    const partes = numPrecio.toString().split('.');
    const entero = partes[0];
    
    // Agregar separadores de miles
    return entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  private resetFormulario(): void {
    this.formProducto.reset();
    this.previewUrls = [];
    this.imagenesSeleccionadas = [];
    this.editando = false;
    this.productoActualId = undefined;
  }

  /**
   * Validador personalizado: rechaza valores negativos
   */
  noNegativeValidator(control: any) {
    if (!control.value) return null;
    const value = parseFloat(control.value);
    return value < 0 ? { negative: true } : null;
  }

  limpiarFiltros(): void {
    this.filtersForm.reset({
      nombre: '',
      categoria_id: '',
      subcategoria_id: '',
      min_precio: '',
      max_precio: ''
    });
  }
}
