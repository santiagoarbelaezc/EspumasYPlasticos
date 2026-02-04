import { Component, ElementRef, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from "../../shared/footer/footer.component";
import { PorQueElegirnosComponent } from "../../components/porque-elegirnos.component/porque-elegirnos.component";
import { ProductosList } from "../../components/productos-list/productos-list";
import { MenuCategorias } from "../../components/menu-categorias/menu-categorias";

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    FooterComponent,
    PorQueElegirnosComponent,
    ProductosList,
    MenuCategorias
],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos implements AfterViewInit {
  @ViewChild('menuCategorias', { read: ElementRef }) menuCategorias!: ElementRef;
  menuVisible = false;

  ngAfterViewInit() {
    // Verificar que el elemento se está capturando correctamente
    console.log('Elemento menuCategorias:', this.menuCategorias?.nativeElement);
  }

  toggleMenu() {
    console.log('toggleMenu llamado, menuVisible actual:', this.menuVisible);
    
    if (this.menuCategorias?.nativeElement) {
      this.menuVisible = !this.menuVisible;
      console.log('Nuevo menuVisible:', this.menuVisible);
      
      if (this.menuVisible) {
        this.menuCategorias.nativeElement.classList.add('menu-visible');
        console.log('Clase menu-visible añadida');
      } else {
        this.menuCategorias.nativeElement.classList.remove('menu-visible');
        console.log('Clase menu-visible removida');
      }
    } else {
      console.error('Elemento menuCategorias no encontrado');
    }
  }

  closeMenu() {
    console.log('closeMenu llamado');
    if (this.menuVisible && this.menuCategorias?.nativeElement) {
      this.menuCategorias.nativeElement.classList.remove('menu-visible');
      this.menuVisible = false;
      console.log('Menú cerrado');
    }
  }

  // Cerrar menú al presionar Escape
  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: Event) {
    this.closeMenu();
  }

  // Cerrar menú al cambiar tamaño de pantalla (si se hace más grande)
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth >= 768 && this.menuVisible) {
      this.closeMenu();
    }
  }
}
