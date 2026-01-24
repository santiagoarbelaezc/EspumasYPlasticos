import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoriaService } from '../../services/categorias/categoria.service';
import { CategoriasExampleService } from '../../services/categorias.example';
import { SubcategoriasExampleService } from '../../services/subcategorias.example';
import { ProductosExampleService } from '../../services/productos.example';
import { SubcategoriaSeleccionadaService } from '../../services/productos/subcategoria-seleccionada.service';
import { CategoriaConSubcategoriasDTO } from '../../models/categorias/categoria-sub.dto';

interface CategoriaConExpanded extends CategoriaConSubcategoriasDTO {
  expanded?: boolean;
}

@Component({
  selector: 'app-menu-categorias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-categorias.html',
  styleUrl: './menu-categorias.css'
})
export class MenuCategorias implements OnInit {
  categorias: CategoriaConExpanded[] = [];
  cargando = false;

  constructor(
    private categoriaService: CategoriaService,
    private categoriasExampleService: CategoriasExampleService,
    private subcategoriasExampleService: SubcategoriasExampleService,
    private productosExampleService: ProductosExampleService,
    private subcategoriaSeleccionadaService: SubcategoriaSeleccionadaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.cargando = true;
    
    // Usar datos del servicio de ejemplo
    const categoriasEjemplo = this.categoriasExampleService.getCategorias();
    const categoriasConSubcategorias = categoriasEjemplo.map(categoria => {
      const subcategorias = this.subcategoriasExampleService.getSubcategoriasPorCategoria(categoria.id);
      return {
        id: categoria.id,
        nombre: categoria.nombre,
        icono_url: categoria.icono_url,
        subcategorias: subcategorias.map(sub => ({
          id: sub.id,
          nombre: sub.nombre,
          cantidad: this.productosExampleService.getProductosPorSubcategoriaId(sub.id).length
        })),
        expanded: false
      };
    });
    
    this.categorias = categoriasConSubcategorias;
    this.cargando = false;

    // Código comentado: Obtener datos del servicio real
    /*
    this.categoriaService.obtenerCategoriasConSubcategorias().subscribe({
      next: (data) => {
        this.categorias = data.map(cat => ({
          ...cat,
          expanded: false
        }));
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
        this.cargando = false;
      }
    });
    */
  }

  toggle(categoria: CategoriaConExpanded): void {
    categoria.expanded = !categoria.expanded;
  }

  /**
   * Selecciona una subcategoría y actualiza la lista de productos
   * @param subcategoriaId ID de la subcategoría seleccionada
   * @param categoriaId ID de la categoría
   */
  seleccionarSubcategoria(subcategoriaId: number, categoriaId: number): void {
    // Actualizar el servicio de subcategoría seleccionada
    this.subcategoriaSeleccionadaService.setSubcategoriaSeleccionada(subcategoriaId);
    
    // Navegar a productos con query params
    this.router.navigate(['/productos'], {
      queryParams: {
        categoria_id: categoriaId,
        subcategoria_id: subcategoriaId
      }
    });
  }

  /**
   * Ver todos los productos de una categoría sin filtro de subcategoría
   * @param categoriaId ID de la categoría
   */
  verTodosProductosDeCategoria(categoriaId: number): void {
    // Actualizar el servicio
    this.subcategoriaSeleccionadaService.setSubcategoriaSeleccionada(null);
    
    // Navegar a productos con query param de categoría
    this.router.navigate(['/productos'], {
      queryParams: {
        categoria_id: categoriaId
      }
    });
  }

  /**
   * Ver todos los productos sin filtro
   */
  verTodosProductos(): void {
    // Resetear la selección de subcategoría
    this.subcategoriaSeleccionadaService.resetear();
    
    // Navegar a productos
    this.router.navigate(['/productos']);
  }
}
