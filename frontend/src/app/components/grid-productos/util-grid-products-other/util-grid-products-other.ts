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
      id: 1,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768952039/grid-8_bt7cis.jpg',
      descripcion: 'Colchones de alta calidad',
      nombre: 'Colchón OrthoMax',
      precio: 1250000,
      link: '/productos?busqueda=colchon&tipo=nombre',
      altura: 'baja'
    },
    {
      id: 2,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768952038/grid-1_mhtqod.jpg',
      descripcion: 'Colchonetas para ejercicios',
      nombre: 'Colchoneta Gym Pro',
      precio: 189900,
      link: '/productos',
      altura: 'alta'
    },
    {
      id: 3,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768952038/grid-7_hxcmfy.jpg',
      descripcion: 'Colchón para cuna bebé',
      nombre: 'Colchón Cuna Premium',
      precio: 349900,
      link: '/productos',
      altura: 'baja'
    },
    {
      id: 4,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768952038/grid-2_xerww3.jpg',
      descripcion: 'Colchones viscoelásticos',
      nombre: 'Colchón Visco Memory',
      precio: 899000,
      link: '/productos',
      altura: 'alta'
    },
    {
      id: 5,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768952038/grid-4_vbom7w.jpg',
      descripcion: 'Cojines ergonómicos',
      nombre: 'Set Cojines Decorativos',
      precio: 249900,
      link: '/productos',
      altura: 'alta'
    },
    {
      id: 6,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768952038/grid-3_sfpknt.jpg',
      descripcion: 'Alcobas completas nórdicas',
      nombre: 'Alcoba Nórdica',
      precio: 2750000,
      link: '/productos',
      altura: 'alta'
    },
    {
      id: 7,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768952038/grid-6_qtmjn8.jpg',
      descripcion: 'Protector impermeable para colchón',
      nombre: 'Protector Colchón',
      precio: 129900,
      link: '/productos',
      altura: 'baja'
    },
    {
      id: 8,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768952038/grid-5_cmbwde.jpg',
      descripcion: 'Sábanas de género premium',
      nombre: 'Sábanas Premium',
      precio: 189900,
      link: '/productos',
      altura: 'baja'
    }
  ];
}