import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoriaService } from '../../../services/categorias/categoria.service';
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

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerCategoriasConSubcategorias().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
      }
    });
  }

  onMouseEnter(): void {
    this.menuVisible = true;
  }

  onMouseLeave(): void {
    this.menuVisible = false;
    this.hoveredCategoriaId = null;
  }

  onCategoriaHover(categoriaId: number): void {
    this.hoveredCategoriaId = categoriaId;
  }

  onCategoriaLeave(): void {
    this.hoveredCategoriaId = null;
  }

  // Cerrar menú cuando se navega
  closeMenu(): void {
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
