import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  constructor(private router: Router) {
    this.initScrollToTop();
  }

  /**
   * Inicializa el servicio para hacer scroll al top cuando cambia la ruta
   */
  private initScrollToTop(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        // Hacer scroll al top de la página con comportamiento smooth
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      });
  }
}
