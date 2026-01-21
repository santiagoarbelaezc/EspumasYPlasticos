import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from "../../shared/footer/footer.component";
import { ValorAgregadoComponent } from "../../shared/valor-agregado/valor-agregado.component";
import { UbicacionComponent } from "../../components/ubicacion/ubicacion.component";
import { RedesSocialesComponent } from "../../shared/botones-sociales/botones-sociales.component";
import { HeroComponent } from "../../components/header-index/header-index.component";
import { HeaderEnlacesComponent } from "../../components/header-enlaces/header-enlaces.component";
import { CarruselHome } from "../../components/carrusel-home/carrusel-home";
import { BannerHome } from "../../components/banner-home/banner-home";
import { CategoriasHome } from "../../components/categorias-home/categorias-home";
import { UtilGridProductos } from "../../components/grid-productos/util-grid-productos/util-grid-productos";
import { UtilGridProductsOther } from "../../components/grid-productos/util-grid-products-other/util-grid-products-other";
import { CarruselCategoryComponent } from '../../shared/carrusel-category/carrusel-category';

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
    CarruselHome,
    BannerHome,
    CategoriasHome,
    UtilGridProductos,
    UtilGridProductsOther,
    CarruselCategoryComponent
],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {}
