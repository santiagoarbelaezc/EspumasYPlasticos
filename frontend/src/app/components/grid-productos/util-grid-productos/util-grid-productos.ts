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
      id: 3,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768833975/imagen-section3_dtqjok.jpg',
      descripcion: 'Colchon Semi Ortopedico Duplex',
      nombre: 'Colchon Semi Ortopedico Duplex',
      precio: 600000,
      link: '/producto/3/detalle-producto-espumasyplasticos',
      altura: 'baja'
    },
    {
      id: 11,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768833975/img-section_qbmhfx.jpg',
      descripcion: 'Colchon Confort Verona',
      nombre: 'Colchon Confort Verona',
      precio: 990000,
      link: '/producto/11/detalle-producto-espumasyplasticos',
      altura: 'alta'
    },
    {
      id: 14,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768833975/img-section2_dwrc99.jpg',
      descripcion: 'Cojineria para Silla Columpio',
      nombre: 'Cojineria para Silla Columpio',
      precio: 150000,
      link: '/producto/14/detalle-producto-espumasyplasticos',
      altura: 'baja'
    },
    {
      id: 24,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768833974/img-section8_nr2yyu.jpg',
      descripcion: 'Sabanas en Género',
      nombre: 'Sabanas en Género',
      precio: 60000,
      link: '/producto/24/detalle-producto-espumasyplasticos',
      altura: 'alta'
    },
    {
      id: 13,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768833975/img-section4_xubdf0.jpg',
      descripcion: 'Almohada Ortopedica Cervical',
      nombre: 'Almohada Ortopedica Cervical',
      precio: 50000,
      link: '/producto/13/detalle-producto-espumasyplasticos',
      altura: 'alta'
    },
    {
      id: 16,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768833975/img-section5_shxle2.jpg',
      descripcion: 'Colchon Ortopedico Premium',
      nombre: 'Colchon Ortopedico Premium',
      precio: 790000,
      link: '/producto/16/detalle-producto-espumasyplasticos',
      altura: 'alta'
    },
    {
      id: 10,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768714512/alcobas_lujv4f.jpg',
      descripcion: 'Alcobas completas estilo nórdico',
      nombre: 'Casata Forro en Tela Acolchada con Cremallera',
      precio: 75000,
      link: '/producto/10/detalle-producto-espumasyplasticos',
      altura: 'baja'
    },
    {
      id: 23,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768833975/img-section6_wqtfpv.jpg',
      descripcion: 'Accesorios para tu descanso',
      nombre: 'Protector Acolchado Impermeable',
      precio: 100000,
      link: '/producto/23/detalle-producto-espumasyplasticos',
      altura: 'baja'
    }
  ];
}