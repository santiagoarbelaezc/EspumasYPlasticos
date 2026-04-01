import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faKey, faMapMarkerAlt, faMagnifyingGlass, faTimes, faShoppingCart, faLeaf } from '@fortawesome/free-solid-svg-icons';
import { MenuDropdownComponent } from './menu-dropdown/menu-dropdown.component';
import { EmpresasDropdownComponent } from './empresas-dropdown/empresas-dropdown.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, MenuDropdownComponent, EmpresasDropdownComponent, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  faKey = faKey;
  faMapMarkerAlt = faMapMarkerAlt;
  faMagnifyingGlass = faMagnifyingGlass;
  faTimes = faTimes;
  faShoppingCart = faShoppingCart;
  faLeaf = faLeaf;
  
  logoHover = false;
  menuAbierto = false;
  scrolled = false;
  searchExpanded = false;
  searchQuery = '';
  showSuggestions = false;
  isSearchFocused = false;
  
  // Sugerencias/recomendaciones específicas
  suggestions = [
    'colchón',
    'colchon',
    'almohada', 
    'sábana',
    'sabana',
    'alcoba',
    'colchoneta',
    'gym',
    'gým',
    'espuma',
    'plástico',
    'plastico'
  ];
  
  filteredSuggestions: string[] = [];

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Test de normalización para debug
    console.log('=== TEST NORMALIZACIÓN ===');
    console.log('gým normalizado:', this.normalizarTexto('gým'));
    console.log('gym normalizado:', this.normalizarTexto('gym'));
    console.log('colchón normalizado:', this.normalizarTexto('colchón'));
    console.log('colchon normalizado:', this.normalizarTexto('colchon'));
    console.log('==========================');
  }

  /**
   * Normaliza una cadena eliminando tildes y diacríticos
   * @param str Cadena a normalizar
   * @returns Cadena sin tildes ni acentos
   */
  private normalizarTexto(str: string): string {
    if (!str) return '';
    
    // Mapa de reemplazos directo para caracteres comunes
    const mapaAcentos: { [key: string]: string } = {
      'á': 'a', 'à': 'a', 'ä': 'a', 'â': 'a', 'ā': 'a', 'ã': 'a',
      'é': 'e', 'è': 'e', 'ë': 'e', 'ê': 'e', 'ē': 'e',
      'í': 'i', 'ì': 'i', 'ï': 'i', 'î': 'i', 'ī': 'i',
      'ó': 'o', 'ò': 'o', 'ö': 'o', 'ô': 'o', 'ō': 'o', 'õ': 'o',
      'ú': 'u', 'ù': 'u', 'ü': 'u', 'û': 'u', 'ū': 'u',
      'ý': 'y', 'ÿ': 'y',
      'ñ': 'n', 'ç': 'c'
    };
    
    return str
      .toLowerCase()
      .split('')
      .map(char => mapaAcentos[char] || char)
      .join('')
      .trim();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Cambia el estado cuando se hace scroll (más de 10px)
    this.scrolled = window.scrollY > 10;
    
    // Cerrar sugerencias al hacer scroll
    if (this.showSuggestions) {
      this.closeSuggestions();
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
    
    // Cerrar sugerencias si se hace clic fuera
    if (this.showSuggestions) {
      const target = event.target as HTMLElement;
      const isClickInsideSearch = target.closest('.search-container') || 
                                  target.closest('.search-input');
      
      if (!isClickInsideSearch) {
        this.closeSuggestions();
      }
    }
    
    // Cerrar buscador si se hace clic fuera en mobile
    if (this.searchExpanded && window.innerWidth <= 768) {
      const target = event.target as HTMLElement;
      const isClickInsideSearch = target.closest('.search-container') || 
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
    
    // Cerrar sugerencias si se abre el menú
    if (this.menuAbierto) {
      this.closeSuggestions();
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
      } else {
        this.closeSuggestions();
      }
    }
  }

  collapseSearch(): void {
    this.searchExpanded = false;
    this.searchQuery = '';
    this.closeSuggestions();
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    
    console.log('=== DEBUG BÚSQUEDA ===');
    console.log('Array de sugerencias:', this.suggestions);
    
    // Filtrar sugerencias según la búsqueda
    if (this.searchQuery.trim()) {
      const queryNormalizada = this.normalizarTexto(this.searchQuery);
      console.log('Query original:', this.searchQuery);
      console.log('Query normalizada:', queryNormalizada);
      
      // Filtrar sugerencias que contengan el texto buscado (normalizado)
      this.filteredSuggestions = this.suggestions.filter(suggestion => {
        const sugerenciaNormalizada = this.normalizarTexto(suggestion);
        const matches = sugerenciaNormalizada.includes(queryNormalizada);
        
        console.log(`Comparando: "${suggestion}" (normalizada: "${sugerenciaNormalizada}") contiene "${queryNormalizada}" = ${matches}`);
        
        return matches;
      });
      
      console.log('Sugerencias filtradas:', this.filteredSuggestions);
      console.log('showSuggestions se pone en:', this.filteredSuggestions.length > 0);
      this.showSuggestions = this.filteredSuggestions.length > 0;
    } else {
      this.filteredSuggestions = [...this.suggestions];
      this.showSuggestions = true;
    }
  }

  onSearchFocus(): void {
    this.isSearchFocused = true;
    // Mostrar sugerencias cuando se enfoca el input
    if (!this.searchQuery.trim()) {
      this.filteredSuggestions = [...this.suggestions];
      this.showSuggestions = true;
    }
  }

  onSearchBlur(): void {
    this.isSearchFocused = false;
    // No cerrar inmediatamente para permitir clic en sugerencias
    setTimeout(() => {
      if (!this.isSearchFocused && !this.isMouseOverSuggestions()) {
        this.closeSuggestions();
      }
    }, 200);
  }

   private performSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('🚨 performSearch() ejecutándose!');
      console.log('Buscando:', this.searchQuery);
      console.trace('Stack trace para ver desde dónde se llama');
      
      // Navegar a la página de productos con el término de búsqueda
      this.router.navigate(['/productos'], { 
        queryParams: { 
          busqueda: this.searchQuery,
          tipo: 'nombre'
        } 
      });
      
      // Cerrar sugerencias
      this.closeSuggestions();
      
      // Cerrar buscador en mobile después de buscar
      if (window.innerWidth <= 768) {
        this.collapseSearch();
      }
      
      // Limpiar búsqueda
      this.searchQuery = '';
    }
  }

  selectSuggestion(suggestion: string): void {
    console.log('🟡 selectSuggestion() ejecutándose con:', suggestion);
    this.searchQuery = suggestion;
    this.performSearch();
  }

  onSearchSubmit(event: Event): void {
    console.log('🔴 onSearchSubmit() ejecutándose!', event);
    event.preventDefault();
    
    if (this.searchQuery.trim()) {
      this.performSearch();
    }
  }

  

  clearSearch(): void {
    this.searchQuery = '';
    this.closeSuggestions();
    if (this.searchInput?.nativeElement) {
      this.searchInput.nativeElement.focus();
    }
  }

  
  private closeSuggestions(): void {
    this.showSuggestions = false;
    this.filteredSuggestions = [];
  }

  private isMouseOverSuggestions(): boolean {
    const suggestionsElement = document.querySelector('.suggestions-container');
    if (!suggestionsElement) return false;
    
    const mouseX = (window as any).mouseX || 0;
    const mouseY = (window as any).mouseY || 0;
    const rect = suggestionsElement.getBoundingClientRect();
    
    return mouseX >= rect.left && 
           mouseX <= rect.right && 
           mouseY >= rect.top && 
           mouseY <= rect.bottom;
  }

  // Método para manejar el clic en el logo (mobile)
  onLogoClick(event: Event): void {
  event.preventDefault();
  
  // Cerrar menús y sugerencias
  if (this.menuAbierto) {
    this.closeMenu();
  }
  if (this.searchExpanded) {
    this.collapseSearch();
  }
  this.closeSuggestions();
  
  // Navegar al inicio
  this.router.navigate(['/']).then(() => {
    // Si ya estábamos en inicio, hacer scroll al top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

  // Método para manejar la navegación (cierra menús)
  navigateAndClose(): void {
    this.closeMenu();
    this.collapseSearch();
    this.closeSuggestions();
  }

  // Método para prevenir eventos no deseados
  preventEvent(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }
}