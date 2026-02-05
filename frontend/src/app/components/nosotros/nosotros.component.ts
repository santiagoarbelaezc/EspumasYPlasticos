import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nosotros-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css'
})
export class NosotrosComponent implements OnInit, OnDestroy {
  imagenesCarrusel = [
    { url: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1770251063/quienes_somos_u6li7u.jpg', alt: 'Producción de espumas' },
    { url: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1770251313/quienes_somos3_u9i0cn.jpg', alt: 'Productos terminados' },
    { url: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1770251544/quienes_somos4_qiixk2.jpg', alt: 'Transformación de materiales' }
  ];

  currentSlide = 0;
  intervalo: any;

  ngOnInit(): void {
    this.intervalo = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.imagenesCarrusel.length;
    }, 4000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalo);
  }
}
