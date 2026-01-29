import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { DescripcionSeleccionado } from '../descripcion-seleccionado/descripcion-seleccionado';

import { GridProductosInteres } from '../grid-productos-interes/grid-productos-interes';
import { CarruselRelacionados } from "../carrusel-relacionados/carrusel-relacionados";
import { UtilGridProductosInteres } from "../util-grid-productos-interes/util-grid-productos-interes";
import { CarruselCategoryComponent } from "../../../shared/carrusel-category/carrusel-category";

@Component({
  selector: 'app-descripcion',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    FooterComponent,
    DescripcionSeleccionado,
    CarruselRelacionados,
    UtilGridProductosInteres,
    CarruselCategoryComponent
],
  templateUrl: './descripcion.html',
  styleUrl: './descripcion.css'
})
export class Descripcion {

}
