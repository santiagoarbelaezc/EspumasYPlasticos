import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faStar, faLeaf, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-por-que-elegirnos',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './porque-elegirnos.component.html',
  styleUrl: './porque-elegirnos.component.css'
})
export class PorQueElegirnosComponent {
  constructor(library: FaIconLibrary) {
    library.addIcons(faStar, faLeaf, faThumbsUp);
  }

  motivos = [
    {
      icono: 'star',
      titulo: 'Calidad Superior',
      texto: 'Nuestros productos están elaborados con los mejores estándares de calidad internacional. Utilizamos materiales premium seleccionados cuidadosamente para garantizar durabilidad, confort y seguridad en cada uno de nuestros artículos.'
    },
    {
      icono: 'leaf',
      titulo: 'Compromiso Ambiental',
      texto: 'Nos comprometemos con la sustentabilidad del planeta. Implementamos materiales eco-friendly y procesos responsables con el medio ambiente en toda nuestra cadena de producción, reduciendo nuestra huella de carbono.'
    },
    {
      icono: 'thumbs-up',
      titulo: 'Confianza Garantizada',
      texto: 'Con más de 20 años de trayectoria, respaldamos el descanso y bienestar de miles de clientes satisfechos. Nuestra reputación se construye sobre garantías sólidas y un servicio al cliente excepcional que te respalda siempre.'
    }
  ];
}
