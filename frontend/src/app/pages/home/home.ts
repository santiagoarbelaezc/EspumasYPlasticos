import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from "../../shared/footer/footer.component";
import { ValorAgregadoComponent } from "../../shared/valor-agregado/valor-agregado.component";
import { UbicacionComponent } from "../../components/ubicacion/ubicacion.component";
import { RedesSocialesComponent } from "../../shared/botones-sociales/botones-sociales.component";
import { HeroComponent } from "../../components/header-index/header-index.component";
import { HeaderEnlacesComponent } from "../../components/header-enlaces/header-enlaces.component";


import { CategoriasHome } from "../../components/categorias-home/categorias-home";
import { UtilGridProductos } from "../../components/grid-productos/util-grid-productos/util-grid-productos";
import { UtilGridProductsOther } from "../../components/grid-productos/util-grid-products-other/util-grid-products-other";
import { CarruselCategoryComponent } from '../../shared/carrusel-category/carrusel-category';
import { BannerFull } from "../../shared/banner-full/banner-full";
import { TrioCard } from "../../shared/trio-card/trio-card";
import { HeaderVideo } from "../../components/header-video/header-video";
import { Producto } from '../../models/productos/producto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent,
    ValorAgregadoComponent,
    UbicacionComponent,
    RedesSocialesComponent,
    HeaderEnlacesComponent,
    HeroComponent,
    CategoriasHome,
    UtilGridProductos,
    UtilGridProductsOther,
    CarruselCategoryComponent,
    BannerFull,
    TrioCard,
    HeaderVideo
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  productosTrioCard: Producto[] = [
    {
      id: 1,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1770337091/basecamatrio_m4clck.jpg',
      nombre: 'Base Cama color gris',
      descripcion: 'Base Cama de alta calidad',
      link: '/productos/detalle/14',
      altura: 'baja' as const,
      precio: 0
    },
    {
      id: 2,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1770337091/colchonetas_ucy7rh.jpg',
      nombre: 'Colchonetas',
      descripcion: 'Colchonetas premium',
      link: '/productos/detalle/19',
      altura: 'alta' as const,
      precio: 0
    },
    {
      id: 3,
      imagen: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1770340043/colchondarktrio_htiy6o.jpg',
      nombre: 'Colchón Comfort',
      descripcion: 'Colchón de máxima comodidad',
      link: '/productos/detalle/3',
      altura: 'baja' as const,
      precio: 0
    }
  ];
}
