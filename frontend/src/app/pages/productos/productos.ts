import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from "../../shared/footer/footer.component";
import { PorQueElegirnosComponent } from "../../components/porque-elegirnos.component/porque-elegirnos.component";
import { ProductosList } from "../../components/productos-list/productos-list";
import { MenuCategorias } from "../../components/menu-categorias/menu-categorias";

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    FooterComponent,
    PorQueElegirnosComponent,
    ProductosList,
    MenuCategorias
],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos {

}
