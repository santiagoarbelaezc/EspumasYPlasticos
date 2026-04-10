import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CategoriaDTO } from '../../../models/categorias/categoria.dto';
import { CategoriaConSubcategoriasDTO } from '../../../models/categorias/categoria-sub.dto';
import { CategoriaService } from '../../../services/categorias/categoria.service';
import { AlertService } from '../../../services/alert.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faSearch, 
  faCheck, 
  faPlus, 
  faTimes, 
  faTrash, 
  faArrowLeft 
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-categorias-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './categorias-admin.component.html',
  styleUrls: ['./categorias-admin.component.css']
})
export class CategoriasAdminComponent implements OnInit {
  categorias: CategoriaDTO[] = [];
  formCategoria!: FormGroup;
  previewUrl?: string;
  editando = false;
  categoriaActualId?: number;
  searchNombre = '';

  // 🎨 Iconos
  faSearch = faSearch;
  faCheck = faCheck;
  faPlus = faPlus;
  faTimes = faTimes;
  faTrash = faTrash;
  faArrowLeft = faArrowLeft;

  // 📄 Paginación
  currentPage = 1;
  pageSize = 5;
  totalCategorias = 0;
  paginatedCategorias: CategoriaDTO[] = [];

  // Exposer Math para templates
  Math = Math;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private alert: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formCategoria = this.fb.group({
      nombre: ['', Validators.required],
      icono: [null]
    });

    this.cargarCategorias();
  }

  volverAlDashboard(): void {
    this.router.navigate(['/admin']);
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerCategorias(this.searchNombre).subscribe({
      next: res => {
        this.categorias = res;
        this.totalCategorias = res.length;
        this.currentPage = 1;
        this.actualizarPaginacion();
      },
      error: err => this.alert.mostrarError('Error al cargar categorías.')
    });
  }

  onSearchChange(event: any): void {
    this.searchNombre = event.target.value;
    this.cargarCategorias();
  }

  actualizarPaginacion(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedCategorias = this.categorias.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.totalCategorias / this.pageSize);
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

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.formCategoria.patchValue({ icono: file });
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  guardarCategoria(): void {
    if (this.formCategoria.invalid) {
      this.alert.mostrarError('El nombre es obligatorio.', 'Campos incompletos');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.formCategoria.value.nombre);
    if (this.formCategoria.value.icono) {
      formData.append('icono', this.formCategoria.value.icono);
    }

    if (this.editando && this.categoriaActualId !== undefined) {
      this.categoriaService.actualizarCategoria(this.categoriaActualId, formData).subscribe({
        next: () => {
          this.alert.mostrarExito('Categoría actualizada correctamente');
          this.resetFormulario();
          this.cargarCategorias();
        },
        error: err => {
          console.error('Error al actualizar categoría:', err);
          this.alert.mostrarError('No se pudo actualizar la categoría.');
        }
      });
    } else {
      this.categoriaService.crearCategoria(formData).subscribe({
        next: () => {
          this.alert.mostrarExito('Categoría creada correctamente');
          this.resetFormulario();
          this.cargarCategorias();
        },
        error: err => {
          console.error('Error al crear categoría:', err);
          this.alert.mostrarError('No se pudo crear la categoría.');
        }
      });
    }
  }

  seleccionar(categoria: CategoriaDTO): void {
    this.editando = true;
    this.categoriaActualId = categoria.id;
    this.formCategoria.patchValue({
      nombre: categoria.nombre
    });
    this.previewUrl = categoria.icono_url;
  }

  cancelarEdicion(): void {
    this.resetFormulario();
  }

  eliminar(id: number): void {
    this.alert.confirmarEliminacion().then(result => {
      if (result.isConfirmed) {
        this.categoriaService.eliminarCategoria(id).subscribe({
          next: () => {
            this.alert.mostrarExito('Categoría eliminada correctamente');
            this.cargarCategorias();
          },
          error: err => {
            console.error('Error al eliminar categoría:', err);
            this.alert.mostrarError('No se pudo eliminar la categoría.');
          }
        });
      }
    });
  }

  private resetFormulario(): void {
    this.formCategoria.reset();
    this.previewUrl = undefined;
    this.editando = false;
    this.categoriaActualId = undefined;
    // Limpiar input file manual si es necesario
    const fileInput = document.getElementById('icono') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
}
