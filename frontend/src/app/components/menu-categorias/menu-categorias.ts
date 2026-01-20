import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoriaService } from '../../services/categorias/categoria.service';
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.cargando = true;
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
  }

  toggle(categoria: CategoriaConExpanded): void {
    categoria.expanded = !categoria.expanded;
  }

  seleccionarSubcategoria(subcategoriaId: number): void {
    // Navegar a productos filtrados por subcategoría
    this.router.navigate(['/productos'], { 
      queryParams: { subcategoria: subcategoriaId } 
    });
  }

  verTodosProductos(): void {
    this.router.navigate(['/productos']);
  }
}
