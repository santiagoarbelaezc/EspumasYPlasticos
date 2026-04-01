import { Component } from '@angular/core';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { AliadosComponent } from "../../components/aliados/aliados.component";
import { NosotrosComponent } from "../../components/nosotros/nosotros.component";
import { MisionVisionComponent } from "../../components/mision-vision/mision-vision.component";
import { LineaDeTiempoComponent } from "../../components/linea-de-tiempo/linea-de-tiempo.component";
import { EmpleadosComponent } from "../../components/empleados/empleados.component";
import { RedesSocialesComponent } from "../../shared/botones-sociales/botones-sociales.component";

@Component({
  selector: 'app-nosotros',
  imports: [NavbarComponent, FooterComponent, AliadosComponent, NosotrosComponent, MisionVisionComponent, LineaDeTiempoComponent, RedesSocialesComponent],
  templateUrl: './nosotros.html',
  styleUrl: './nosotros.css'
})
export class Nosotros {

}
