import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ScrollService } from './services/scroll.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Espumas Y Plásticos';

  constructor(private scrollService: ScrollService) {
    // El servicio se inicializa automáticamente en el constructor
  }
}
