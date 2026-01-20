import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faKey, faMapMarkerAlt, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { MenuDropdownComponent } from './menu-dropdown/menu-dropdown.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, MenuDropdownComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  faKey = faKey;
  faMapMarkerAlt = faMapMarkerAlt;
  faMagnifyingGlass = faMagnifyingGlass;
  
  logoHover = false;
  menuAbierto = false;
  scrolled = false;
  searchExpanded = false;
  searchQuery = '';

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Cambia el estado cuando se hace scroll (más de 10px)
    this.scrolled = window.scrollY > 10;
    
    // Cerrar buscador al hacer scroll en mobile
    if (this.searchExpanded && window.innerWidth <= 768) {
      this.collapseSearch();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Cerrar menú si se hace clic fuera
    if (this.menuAbierto) {
      const target = event.target as HTMLElement;
      const isClickInsideMenu = target.closest('.navbar-content') || 
                                 target.closest('.hamburger') || 
                                 target.closest('.logo-mobile');
      
      if (!isClickInsideMenu && !target.closest('.navbar-right')) {
        this.closeMenu();
      }
    }
    
    // Cerrar buscador si se hace clic fuera en mobile
    if (this.searchExpanded && window.innerWidth <= 768) {
      const target = event.target as HTMLElement;
      const isClickInsideSearch = target.closest('.search-wrapper') || 
                                  target.closest('.search-input');
      
      if (!isClickInsideSearch) {
        this.collapseSearch();
      }
    }
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // Cerrar menú al cambiar a desktop
    if (window.innerWidth > 768 && this.menuAbierto) {
      this.closeMenu();
    }
    
    // Cerrar buscador expandido al cambiar a desktop
    if (window.innerWidth > 768 && this.searchExpanded) {
      this.searchExpanded = false;
    }
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
    
    // Cerrar buscador si se abre el menú
    if (this.menuAbierto && this.searchExpanded) {
      this.collapseSearch();
    }
    
    // Bloquear scroll del body cuando el menú está abierto
    if (this.menuAbierto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMenu(): void {
    this.menuAbierto = false;
    document.body.style.overflow = '';
  }

  toggleSearch(): void {
    if (window.innerWidth <= 768) { // Solo en mobile
      this.searchExpanded = !this.searchExpanded;
      
      if (this.searchExpanded) {
        // Cerrar menú si está abierto
        if (this.menuAbierto) {
          this.closeMenu();
        }
        
        // Enfocar el input después de la animación
        setTimeout(() => {
          if (this.searchInput?.nativeElement) {
            this.searchInput.nativeElement.focus();
          }
        }, 150);
      }
    }
  }

  collapseSearch(): void {
    this.searchExpanded = false;
    this.searchQuery = '';
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
  }

  onSearchSubmit(event: Event): void {
    event.preventDefault();
    
    if (this.searchQuery.trim()) {
      // Aquí puedes implementar la lógica de búsqueda
      console.log('Buscando:', this.searchQuery);
      
      // Cerrar buscador en mobile después de buscar
      if (window.innerWidth <= 768) {
        this.collapseSearch();
      }
    }
  }

  // Método para manejar el clic en el logo (mobile)
  onLogoClick(): void {
    if (this.menuAbierto) {
      this.closeMenu();
    }
    if (this.searchExpanded) {
      this.collapseSearch();
    }
  }

  // Método para manejar la navegación (cierra menús)
  navigateAndClose(): void {
    this.closeMenu();
    this.collapseSearch();
  }

  // Método para prevenir eventos no deseados
  preventEvent(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }
}