import { Component } from '@angular/core';
import { GridProductosComponent } from '../grid-productos';
import { Producto } from '../../../models/productos/producto';

@Component({
  selector: 'app-util-grid-products-other',
  imports: [GridProductosComponent],
  templateUrl: './util-grid-products-other.html',
  styleUrl: './util-grid-products-other.css',
})
export class UtilGridProductsOther {
  productos: Producto[] = [
    {
      id: 14,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768952039/grid-8_bt7cis.jpg',
      descripcion: 'Colchones de alta calidad',
      nombre: 'Colchon Ortopedico Premium',
      precio: 500000,
      link: '/producto/14/detalle-producto-espumasyplasticos',
      altura: 'baja'
    },
    {
      id: 26,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768952038/grid-1_mhtqod.jpg',
      descripcion: 'Colchonetas para ejercicios',
      nombre: 'Colchoneta Gym',
      precio: 80000,
      link: '/producto/26/detalle-producto-espumasyplasticos',
      altura: 'alta'
    },
    {
      id: 9,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768952038/grid-7_hxcmfy.jpg',
      descripcion: 'Colchón para cuna bebé',
      nombre: 'Colchon para Cuna',
      precio: 100000,
      link: '/producto/9/detalle-producto-espumasyplasticos',
      altura: 'baja'
    },
    {
      id: 19,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768952038/grid-2_xerww3.jpg',
      descripcion: 'Colchones viscoelásticos',
      nombre: 'Colchon Ortopedico Romance Relax',
      precio: 500000,
      link: '/producto/19/detalle-producto-espumasyplasticos',
      altura: 'alta'
    },
    {
      id: 22,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768952038/grid-4_vbom7w.jpg',
      descripcion: 'Cojines ergonómicos',
      nombre: 'Cojin TV Triangular',
      precio: 70000,
      link: '/producto/22/detalle-producto-espumasyplasticos',
      altura: 'alta'
    },
    {
      id: 11,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768952038/grid-3_sfpknt.jpg',
      descripcion: 'Alcobas completas nórdicas',
      nombre: 'Alcoba Pino',
      precio: 850000,
      link: '/producto/11/detalle-producto-espumasyplasticos',
      altura: 'alta'
    },
    {
      id: 23,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768952038/grid-6_qtmjn8.jpg',
      descripcion: 'Protector impermeable para colchón',
      nombre: 'Protector Acolchado Impermeable',
      precio: 100000,
      link: '/producto/23/detalle-producto-espumasyplasticos',
      altura: 'baja'
    },
    {
      id: 24,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768952038/grid-5_cmbwde.jpg',
      descripcion: 'Sábanas de género premium',
      nombre: 'Sabanas en Género',
      precio: 60000,
      link: '/producto/24/detalle-producto-espumasyplasticos',
      altura: 'baja'
    }
  ];
}