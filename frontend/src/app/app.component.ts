import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ScrollService } from './services/scroll.service';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Espumas Y Plásticos';

  constructor(
    private scrollService: ScrollService,
    private seoService: SeoService
  ) {
    // El servicio se inicializa automáticamente en el constructor
  }

  ngOnInit(): void {
    this.seoService.setDefaultSeo();
  }
}
