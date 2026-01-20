import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProductoDTO } from '../../../models/productos/producto.dto';
import { SubcategoriaDTO } from '../../../models/subcategorias/subcategoria.dto';
import { ProductoService } from '../../../services/productos/producto.service';
import { SubcategoriaService } from '../../../services/subcategorias/subcategoria.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-productos-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
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
    private alert: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formProducto = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      precio: ['', [Validators.required, Validators.min(0.01)]],
      subcategoria_id: ['', Validators.required]
    });

    this.cargarSubcategorias();
    this.cargarProductos();
  }

  volverAlDashboard(): void {
    this.router.navigate(['/admin']);
  }

  cargarSubcategorias(): void {
    this.subcategoriaService.obtenerSubcategorias().subscribe({
      next: res => this.subcategorias = res,
      error: err => this.alert.mostrarError('Error al cargar subcategorías.')
    });
  }

  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe({
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
}
