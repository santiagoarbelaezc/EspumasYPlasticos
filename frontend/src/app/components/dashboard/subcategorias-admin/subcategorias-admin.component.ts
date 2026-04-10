import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { SubcategoriaDTO } from '../../../models/subcategorias/subcategoria.dto';
import { CategoriaDTO } from '../../../models/categorias/categoria.dto';
import { SubcategoriaService } from '../../../services/subcategorias/subcategoria.service';
import { CategoriaService } from '../../../services/categorias/categoria.service';
import { AlertService } from '../../../services/alert.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faSearch, 
  faRotate, 
  faCheck, 
  faPlus, 
  faTimes, 
  faTrash, 
  faArrowLeft 
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-subcategorias-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './subcategorias-admin.component.html',
  styleUrls: ['./subcategorias-admin.component.css']
})
export class SubcategoriasAdminComponent implements OnInit {
  subcategorias: SubcategoriaDTO[] = [];
  categorias: CategoriaDTO[] = [];
  formSubcategoria!: FormGroup;
  editando = false;
  subcategoriaActualId?: number;
  filtersForm!: FormGroup;

  // 🎨 Iconos
  faSearch = faSearch;
  faRotate = faRotate;
  faCheck = faCheck;
  faPlus = faPlus;
  faTimes = faTimes;
  faTrash = faTrash;
  faArrowLeft = faArrowLeft;

  // 📄 Paginación
  currentPage = 1;
  pageSize = 5;
  totalSubcategorias = 0;
  paginatedSubcategorias: SubcategoriaDTO[] = [];

  // Exposer Math para templates
  Math = Math;

  constructor(
    private fb: FormBuilder,
    private subcategoriaService: SubcategoriaService,
    private categoriaService: CategoriaService,
    private alert: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formSubcategoria = this.fb.group({
      nombre: ['', Validators.required],
      categoria_id: ['', Validators.required]
    });

    this.filtersForm = this.fb.group({
      nombre: [''],
      categoria_id: ['']
    });

    this.filtersForm.valueChanges.subscribe(() => {
      this.cargarSubcategorias();
    });

    this.cargarCategorias();
    this.cargarSubcategorias();
  }

  volverAlDashboard(): void {
    this.router.navigate(['/admin']);
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerCategorias().subscribe({
      next: res => this.categorias = res,
      error: err => this.alert.mostrarError('Error al cargar categorías.')
    });
  }

  cargarSubcategorias(): void {
    const filtros = this.filtersForm?.value;
    this.subcategoriaService.obtenerSubcategorias(filtros).subscribe({
      next: res => {
        this.subcategorias = res;
        this.totalSubcategorias = res.length;
        this.currentPage = 1;
        this.actualizarPaginacion();
      },
      error: err => this.alert.mostrarError('Error al cargar subcategorías.')
    });
  }

  limpiarFiltros(): void {
    this.filtersForm.reset({
      nombre: '',
      categoria_id: ''
    });
  }

  actualizarPaginacion(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedSubcategorias = this.subcategorias.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.totalSubcategorias / this.pageSize);
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

  guardarSubcategoria(): void {
    if (this.formSubcategoria.invalid) {
      this.alert.mostrarError('Complete todos los campos obligatorios.', 'Campos incompletos');
      return;
    }

    const { nombre, categoria_id } = this.formSubcategoria.value;

    if (this.editando && this.subcategoriaActualId !== undefined) {
      this.subcategoriaService.actualizarSubcategoria(this.subcategoriaActualId, nombre, categoria_id).subscribe({
        next: () => {
          this.alert.mostrarExito('Subcategoría actualizada correctamente');
          this.resetFormulario();
          this.cargarSubcategorias();
        },
        error: err => {
          console.error('Error al actualizar subcategoría:', err);
          this.alert.mostrarError('No se pudo actualizar la subcategoría.');
        }
      });
    } else {
      this.subcategoriaService.crearSubcategoria(nombre, categoria_id).subscribe({
        next: () => {
          this.alert.mostrarExito('Subcategoría creada correctamente');
          this.resetFormulario();
          this.cargarSubcategorias();
        },
        error: err => {
          console.error('Error al crear subcategoría:', err);
          this.alert.mostrarError('No se pudo crear la subcategoría.');
        }
      });
    }
  }

  seleccionar(subcategoria: SubcategoriaDTO): void {
    this.editando = true;
    this.subcategoriaActualId = subcategoria.id;
    this.formSubcategoria.patchValue({
      nombre: subcategoria.nombre,
      categoria_id: subcategoria.categoria_id
    });
  }

  cancelarEdicion(): void {
    this.resetFormulario();
  }

  eliminar(id: number): void {
    this.alert.confirmarEliminacion().then(result => {
      if (result.isConfirmed) {
        this.subcategoriaService.eliminarSubcategoria(id).subscribe({
          next: () => {
            this.alert.mostrarExito('Subcategoría eliminada correctamente');
            this.cargarSubcategorias();
          },
          error: err => {
            console.error('Error al eliminar subcategoría:', err);
            this.alert.mostrarError('No se pudo eliminar la subcategoría.');
          }
        });
      }
    });
  }

  private resetFormulario(): void {
    this.formSubcategoria.reset();
    this.editando = false;
    this.subcategoriaActualId = undefined;
  }

  /**
   * Obtiene el nombre de la categoría por su ID
   * @param categoriaId ID de la categoría
   * @returns Nombre de la categoría o 'Sin categoría'
   */
  obtenerNombreCategoria(categoriaId: number): string {
    const categoria = this.categorias.find(c => c.id === categoriaId);
    return categoria?.nombre || 'Sin categoría';
  }
}
