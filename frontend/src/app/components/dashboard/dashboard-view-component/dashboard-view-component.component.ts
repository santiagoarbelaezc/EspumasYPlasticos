import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { ImportarService } from '../../../services/importar.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTags, faLayerGroup, faBox, faSync } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-view-component',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './dashboard-view-component.component.html',
  styleUrls: ['./dashboard-view-component.component.css']
})
export class DashboardViewComponentComponent {
  faCategorias = faTags;
  faSubcategorias = faLayerGroup;
  faProductos = faBox;
  faImportar = faSync;

  constructor(
    private router: Router, 
    private alert: AlertService,
    private importarService: ImportarService
  ) {}

  navegar(ruta: string): void {
    this.router.navigate([`/admin/${ruta}`]);
  }

  ejecutarImportacion(): void {
    Swal.fire({
      title: 'Sincronizando productos...',
      text: 'Esto puede tardar unos segundos, por favor espera.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.importarService.ejecutarImportacion().subscribe({
      next: (res) => {
        Swal.close();
        this.alert.mostrarExito(
          `Se han importado ${res.importados} productos y actualizado ${res.actualizados}.`,
          'Sincronización Exitosa'
        );
      },
      error: (err) => {
        Swal.close();
        const msg = err.error?.mensaje || 'Ocurrió un error inesperado durante la importación.';
        this.alert.mostrarError(msg, 'Error en Sincronización');
      }
    });
  }
}
