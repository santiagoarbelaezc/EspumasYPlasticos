import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoriaService } from '../../../services/categorias/categoria.service';
import { CategoriasExampleService } from '../../../services/categorias.example';
import { SubcategoriasExampleService } from '../../../services/subcategorias.example';
import { ProductosExampleService } from '../../../services/productos.example';
import { CategoriaConSubcategoriasDTO } from '../../../models/categorias/categoria-sub.dto';

@Component({
  selector: 'app-menu-dropdown',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-dropdown.component.html',
  styleUrls: ['./menu-dropdown.component.css']
})
export class MenuDropdownComponent implements OnInit {
  categorias: CategoriaConSubcategoriasDTO[] = [];
  menuVisible = false;
  hoveredCategoriaId: number | null = null;
  private closeMenuTimer: any;

  constructor(
    private categoriaService: CategoriaService,
    private categoriasExampleService: CategoriasExampleService,
    private subcategoriasExampleService: SubcategoriasExampleService,
    private productosExampleService: ProductosExampleService
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    // Usar datos del servicio de ejemplo
    const categoriasEjemplo = this.categoriasExampleService.getCategorias();
    this.categorias = categoriasEjemplo.map(categoria => {
      const subcategorias = this.subcategoriasExampleService.getSubcategoriasPorCategoria(categoria.id);
      return {
        id: categoria.id,
        nombre: categoria.nombre,
        icono_url: categoria.icono_url,
        subcategorias: subcategorias.map(sub => ({
          id: sub.id,
          nombre: sub.nombre,
          cantidad: this.productosExampleService.getProductosPorSubcategoriaId(sub.id).length
        }))
      };
    });

    // Código comentado: Obtener datos del servicio real
    /*
    this.categoriaService.obtenerCategoriasConSubcategorias().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
      }
    });
    */
  }

  onMouseEnter(): void {
    // Cancelar cualquier timer de cierre pendiente
    if (this.closeMenuTimer) {
      clearTimeout(this.closeMenuTimer);
      this.closeMenuTimer = null;
    }
    this.menuVisible = true;
  }

  onMouseLeave(): void {
    // Esperar 1 segundo antes de cerrar el menú
    this.closeMenuTimer = setTimeout(() => {
      this.menuVisible = false;
      this.hoveredCategoriaId = null;
    }, 1000);
  }

  onCategoriaHover(categoriaId: number): void {
    this.hoveredCategoriaId = categoriaId;
  }

  onCategoriaLeave(): void {
    this.hoveredCategoriaId = null;
  }

  // Cerrar menú cuando se navega
  closeMenu(): void {
    // Cancelar cualquier timer pendiente
    if (this.closeMenuTimer) {
      clearTimeout(this.closeMenuTimer);
      this.closeMenuTimer = null;
    }
    this.menuVisible = false;
    this.hoveredCategoriaId = null;
  }

  @HostListener('window:resize', [])
  onWindowResize(): void {
    // Cerrar menú en mobile
    if (window.innerWidth <= 768) {
      this.closeMenu();
    }
  }
}
