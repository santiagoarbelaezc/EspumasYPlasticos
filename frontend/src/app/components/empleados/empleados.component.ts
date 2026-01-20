import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-empleados-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './empleados.component.html',
  styleUrl: './empleados.component.css'
})
export class EmpleadosComponent implements OnInit {
  @Input() titulo: string = 'Las personas detrás de Espumas y Plásticos';
  @Input() descripcion: string = 'Transformamos insumos en productos para el descanso, pero son nuestras manos, corazones y talentos los que realmente hacen la diferencia. Nuestro equipo es el motor que da vida a cada espuma, cada corte, cada producto final. Gracias a ellos, llevamos confort a miles de hogares.';
  @Input() imagenes: string[] = [
    
  ];

  currentIndex: number = 0;
  transformStyle: string = 'translateX(0)';

  ngOnInit(): void {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.imagenes.length;
      this.transformStyle = `translateX(-${this.currentIndex * 500}px)`; // 500px = ancho de imagen
    }, 1500); // cada 5 segundos
  }
}
