import { Component } from '@angular/core';
import { GridProductosInteres } from '../grid-productos-interes/grid-productos-interes';
import { Producto } from '../../../models/productos/producto';

@Component({
  selector: 'app-util-grid-productos-interes',
  standalone: true,
  imports: [GridProductosInteres],
  templateUrl: './util-grid-productos-interes.html',
  styleUrls: ['./util-grid-productos-interes.css']
})
export class UtilGridProductosInteres {
  productos: Producto[] = [
    // Primeros 8 productos (visibles inicialmente)
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
    },
    // Productos adicionales (se muestran al hacer clic en "Ver más")
    {
      id: 9,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768833975/imagen-section3_dtqjok.jpg',
      descripcion: 'Colchones económicos de buena calidad',
      nombre: 'Colchón Económico',
      precio: 699000,
      link: '/productos',
      altura: 'alta'
    },
    {
      id: 10,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768833975/img-section_qbmhfx.jpg',
      descripcion: 'Sábanas de algodón pima',
      nombre: 'Sábanas Algodón',
      precio: 189900,
      link: '/productos',
      altura: 'baja'
    },
    {
      id: 11,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768833975/img-section2_dwrc99.jpg',
      descripcion: 'Cojines decorativos varios diseños',
      nombre: 'Cojines Decorativos',
      precio: 129900,
      link: '/productos',
      altura: 'alta'
    },
    {
      id: 12,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768833974/img-section8_nr2yyu.jpg',
      descripcion: 'Almohadas ortopédicas especiales',
      nombre: 'Almohada Orto',
      precio: 129900,
      link: '/productos',
      altura: 'baja'
    },
    {
      id: 13,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768833975/img-section4_xubdf0.jpg',
      descripcion: 'Colchones viscoelásticos premium',
      nombre: 'Colchón Visco',
      precio: 1590000,
      link: '/productos',
      altura: 'alta'
    },
    {
      id: 14,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768833975/img-section5_shxle2.jpg',
      descripcion: 'Sábanas de satén premium',
      nombre: 'Sábanas Satén',
      precio: 299900,
      link: '/productos',
      altura: 'baja'
    },
    {
      id: 15,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768714512/alcobas_lujv4f.jpg',
      descripcion: 'Alcobas premium con diseño exclusivo',
      nombre: 'Alcoba Premium',
      precio: 3250000,
      link: '/productos',
      altura: 'alta'
    }
  ];
}