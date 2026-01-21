import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarruselFull } from '../../shared/carrusel-full/carrusel-full';

@Component({
  selector: 'app-carrusel-home',
  standalone: true,
  imports: [CommonModule, CarruselFull],
  templateUrl: './carrusel-home.html',
  styleUrl: './carrusel-home.css'
})
export class CarruselHome {
  // El carrusel ahora carga los productos automáticamente desde los servicios
}
