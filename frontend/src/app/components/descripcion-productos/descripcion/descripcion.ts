import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { DescripcionSeleccionado } from '../descripcion-seleccionado/descripcion-seleccionado';

import { GridProductosInteres } from '../grid-productos-interes/grid-productos-interes';

@Component({
  selector: 'app-descripcion',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    FooterComponent,
    DescripcionSeleccionado,
    GridProductosInteres
  ],
  templateUrl: './descripcion.html',
  styleUrl: './descripcion.css'
})
export class Descripcion {

}
