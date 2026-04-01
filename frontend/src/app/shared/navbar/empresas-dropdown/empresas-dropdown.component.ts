import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empresas-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empresas-dropdown.component.html',
  styleUrls: ['./empresas-dropdown.component.css']
})
export class EmpresasDropdownComponent {
  menuVisible = false;
  private closeMenuTimer: any;

  empresas = [
    { nombre: 'Plaxtilineas', url: 'https://www.plaxtilineas.com/' },
    { nombre: 'Districol', url: 'https://colchonesdistricol.com/' }
  ];

  onMouseEnter(): void {
    if (this.closeMenuTimer) {
      clearTimeout(this.closeMenuTimer);
      this.closeMenuTimer = null;
    }
    this.menuVisible = true;
  }

  onMouseLeave(): void {
    this.closeMenuTimer = setTimeout(() => {
      this.menuVisible = false;
    }, 500);
  }

  closeMenu(): void {
    if (this.closeMenuTimer) {
      clearTimeout(this.closeMenuTimer);
      this.closeMenuTimer = null;
    }
    this.menuVisible = false;
  }

  @HostListener('window:resize', [])
  onWindowResize(): void {
    if (window.innerWidth <= 768) {
      this.closeMenu();
    }
  }
}
