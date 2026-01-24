import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';

@Component({
  selector: 'app-redes-sociales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './botones-sociales.component.html',
  styleUrls: ['./botones-sociales.component.css']
})
export class RedesSocialesComponent implements OnInit, OnDestroy {
  hoveredButton: string | null = null;
  showHelpMessage = false;
  private helpMessageTimeout: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const ua = navigator.userAgent;
      if (/iPhone/.test(ua)) {
        document.body.classList.add('ios');
      } else if (/Android/.test(ua)) {
        document.body.classList.add('android');
      }
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.showHelpMessage = true;
      }, 2000);
    }
  }

  ngOnDestroy(): void {
    if (this.helpMessageTimeout) {
      clearTimeout(this.helpMessageTimeout);
    }
  }

  onMouseEnter(button: string): void {
    this.hoveredButton = button;
  }

  onMouseLeave(button: string): void {
    this.hoveredButton = null;
  }

  closeHelpMessage(): void {
    this.showHelpMessage = false;
  }
}
