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
        descripcion: 'Colchones',
        link: '/productos',
        altura: 'baja'
      },
      {
        id: 2,
        imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768952038/grid-1_mhtqod.jpg',
        descripcion: 'Colchonetas Gym',
        link: '/productos',
        altura: 'alta'
      },
      {
        id: 3,
        imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768952038/grid-7_hxcmfy.jpg',
        descripcion: 'Colchón Cuna',
        link: '/productos',
        altura: 'baja'
      },
      {
        id: 4,
        imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768952038/grid-2_xerww3.jpg',
        descripcion: 'Colchones',
        link: '/productos',
        altura: 'alta'
      },
      {
        id: 5,
        imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768952038/grid-4_vbom7w.jpg',
        
        descripcion: 'Cojineria',
        link: '/productos',
        altura: 'alta'
      },
      {
        id: 6,
        imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768952038/grid-3_sfpknt.jpg',
        
        descripcion: 'Protector Colchón',
        link: '/productos',
        altura: 'alta'
      },
      {
        id: 7,
        imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768952038/grid-6_qtmjn8.jpg',
        descripcion: 'Alcobas',
        link: '/productos',
        altura: 'baja'
      },
      {
        id: 8,
        imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768952038/grid-5_cmbwde.jpg',
        descripcion: 'Sabanas Género',
        link: '/productos',
        altura: 'baja'
      }
    ];

}
