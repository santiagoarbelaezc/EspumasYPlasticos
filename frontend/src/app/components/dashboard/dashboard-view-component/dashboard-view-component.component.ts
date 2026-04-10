import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { ImportarService, ProductoPreview } from '../../../services/importar.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTags, faLayerGroup, faBox, faSync,
  faCloudDownloadAlt, faEye, faCheckCircle,
  faExclamationTriangle, faSpinner, faImage,
  faBoxOpen
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-view-component',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './dashboard-view-component.component.html',
  styleUrls: ['./dashboard-view-component.component.css']
})
export class DashboardViewComponentComponent implements OnInit {
  // Icons
  faCategorias = faTags;
  faSubcategorias = faLayerGroup;
  faProductos = faBox;
  faImportar = faSync;
  faCloud = faCloudDownloadAlt;
  faEye = faEye;
  faCheck = faCheckCircle;
  faWarn = faExclamationTriangle;
  faSpinner = faSpinner;
  faImage = faImage;
  faBoxOpen = faBoxOpen;

  // Estado
  productosPreview: ProductoPreview[] = [];
  cargandoPreview = false;
  sincronizando = false;
  previewVisible = false;
  ultimaSincronizacion: string | null = null;

  constructor(
    private router: Router,
    private alert: AlertService,
    private importarService: ImportarService
  ) {}

  ngOnInit(): void {
    this.cargarVistaPrevia();
  }

  navegar(ruta: string): void {
    this.router.navigate([`/admin/${ruta}`]);
  }

  cargarVistaPrevia(): void {
    this.cargandoPreview = true;
    this.importarService.obtenerVistaPrevia().subscribe({
      next: (res: any) => {
        this.productosPreview = res?.data?.productos ?? res?.productos ?? [];
        this.cargandoPreview = false;
        this.previewVisible = true;
      },
      error: (err) => {
        console.error('Error al cargar vista previa:', err);
        this.cargandoPreview = false;
      }
    });
  }

  ejecutarImportacion(): void {
    Swal.fire({
      title: 'Sincronizando productos...',
      text: 'Importando desde el catálogo Hostinger. Por favor espera.',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    this.sincronizando = true;

    this.importarService.ejecutarImportacion().subscribe({
      next: (res: any) => {
        this.sincronizando = false;
        Swal.close();
        this.ultimaSincronizacion = new Date().toLocaleString();
        this.alert.mostrarExito(
          `Importados: ${res.importados ?? res?.data?.importados ?? 0} | Actualizados: ${res.actualizados ?? res?.data?.actualizados ?? 0}`,
          '✅ Sincronización Exitosa'
        );
        this.cargarVistaPrevia();
      },
      error: (err) => {
        this.sincronizando = false;
        Swal.close();
        const msg = err.error?.mensaje || err.error?.message || 'Error inesperado durante la importación.';
        this.alert.mostrarError(msg, '❌ Error en Sincronización');
      }
    });
  }

  getPrimeraImagen(producto: ProductoPreview): string {
    return producto.imagenes?.[0]?.url ?? '';
  }

  getPrecioMin(producto: ProductoPreview): number {
    if (!producto.variantes?.length) return 0;
    return Math.min(...producto.variantes.map(v => Number(v.price) || 0));
  }
}
