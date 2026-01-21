import { Component } from '@angular/core';
import { GridProductosComponent } from '../grid-productos';
import { Producto } from '../../../models/productos/producto';

@Component({
  selector: 'app-util-grid-productos',
  standalone: true,
  imports: [GridProductosComponent],
  templateUrl: './util-grid-productos.html',
  styleUrl: './util-grid-productos.css'
})
export class UtilGridProductos {
  productos: Producto[] = [
    {
      id: 1,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768833975/imagen-section3_dtqjok.jpg',
      descripcion: 'Colchones de máxima calidad',
      nombre: 'Colchón OrthoMax',
      precio: 1250000,
      link: '/productos',
      altura: 'baja'
    },
    {
      id: 2,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768833975/img-section_qbmhfx.jpg',
      descripcion: 'Sábanas 100% algodón egipcio',
      nombre: 'Sábanas Premium',
      precio: 249900,
      link: '/productos',
      altura: 'alta'
    },
    {
      id: 3,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768833975/img-section2_dwrc99.jpg',
      descripcion: 'Cojines ergonómicos y decorativos',
      nombre: 'Set Cojines',
      precio: 189900,
      link: '/productos',
      altura: 'baja'
    },
    {
      id: 4,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768833974/img-section8_nr2yyu.jpg',
      descripcion: 'Almohadas viscoelásticas',
      nombre: 'Almohada Memory',
      precio: 89900,
      link: '/productos',
      altura: 'alta'
    },
    {
      id: 5,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768833975/img-section4_xubdf0.jpg',
      descripcion: 'Colchones con tecnología avanzada',
      nombre: 'Colchón Premium+',
      precio: 1890000,
      link: '/productos',
      altura: 'alta'
    },
    {
      id: 6,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768833975/img-section5_shxle2.jpg',
      descripcion: 'Sábanas de seda y satén',
      nombre: 'Sábanas Deluxe',
      precio: 349900,
      link: '/productos',
      altura: 'alta'
    },
    {
      id: 7,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768714512/alcobas_lujv4f.jpg',
      descripcion: 'Alcobas completas estilo nórdico',
      nombre: 'Alcoba Nórdica',
      precio: 2750000,
      link: '/productos',
      altura: 'baja'
    },
    {
      id: 8,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768833975/img-section6_wqtfpv.jpg',
      descripcion: 'Accesorios para tu descanso',
      nombre: 'Kit Accesorios',
      precio: 159900,
      link: '/productos',
      altura: 'baja'
    }
  ];
}