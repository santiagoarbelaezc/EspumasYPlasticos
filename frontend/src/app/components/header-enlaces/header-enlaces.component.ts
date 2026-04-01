import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-enlaces',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-enlaces.component.html',
  styleUrl: './header-enlaces.component.css'
})
export class HeaderEnlacesComponent implements OnInit {
  hideTitle = false;
  titulo = 'Encuentra soluciones';
  subtitulo = 'Explora nuestras categorías y marcas';
  logoSrc = 'assets/img/logo-grande.png';

  ngOnInit(): void {
    setTimeout(() => {
      this.hideTitle = true;
    }, 2000);
  }

 items = [
    {
      title: 'Colchones',
      img: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768958817/banner3_vyhxja.jpg',
      link: '/colchones'
    },
    {
      title: 'Catálogo',
      img: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768958816/banner_tnds6k.jpg',
      link: '/catalogo'
    },
    {
      title: 'Creación para el descanso',
      img: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768958817/banner2_uoehvw.jpg',
      link: '/descanso'
    }
  ];
}
