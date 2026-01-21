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
  private helpMessageInterval: any;
  private helpMessageTimeout: any;
  private mouseLeaveTimeout: any;

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
        this.showHelpMessage();
        this.startHelpMessageCycle();
      }, 2000);
      this.setupWhatsAppHover();
    }
  }

  ngOnDestroy(): void {
    if (this.helpMessageInterval) {
      clearInterval(this.helpMessageInterval);
    }
    if (this.helpMessageTimeout) {
      clearTimeout(this.helpMessageTimeout);
    }
    if (this.mouseLeaveTimeout) {
      clearTimeout(this.mouseLeaveTimeout);
    }
  }

  private showHelpMessage(): void {
    const helpMessage = document.getElementById('helpMessage');
    if (helpMessage) {
      helpMessage.classList.add('show');
      this.helpMessageTimeout = setTimeout(() => {
        helpMessage.classList.remove('show');
      }, 4000);
    }
  }

  private hideHelpMessage(): void {
    const helpMessage = document.getElementById('helpMessage');
    if (helpMessage) {
      helpMessage.classList.remove('show');
    }
  }

  private startHelpMessageCycle(): void {
    this.helpMessageInterval = setInterval(() => {
      this.showHelpMessage();
    }, 12000);
  }

  private setupWhatsAppHover(): void {
    const whatsappButton = document.querySelector('.whatsapp-button');
    const helpMessage = document.getElementById('helpMessage');
    if (whatsappButton && helpMessage) {
      whatsappButton.addEventListener('mouseenter', () => {
        if (this.mouseLeaveTimeout) {
          clearTimeout(this.mouseLeaveTimeout);
        }
        if (this.helpMessageInterval) {
          clearInterval(this.helpMessageInterval);
        }
        helpMessage.classList.add('show');
      });
      whatsappButton.addEventListener('mouseleave', () => {
        this.mouseLeaveTimeout = setTimeout(() => {
          helpMessage.classList.remove('show');
          this.startHelpMessageCycle();
        }, 2000);
      });
      helpMessage.addEventListener('mouseenter', () => {
        if (this.mouseLeaveTimeout) {
          clearTimeout(this.mouseLeaveTimeout);
        }
        helpMessage.classList.add('show');
      });
      helpMessage.addEventListener('mouseleave', () => {
        this.mouseLeaveTimeout = setTimeout(() => {
          helpMessage.classList.remove('show');
        }, 1000);
      });
    }
  }

  // Métodos públicos para el template si se requieren
  onWhatsAppMouseEnter(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.mouseLeaveTimeout) {
        clearTimeout(this.mouseLeaveTimeout);
      }
      if (this.helpMessageInterval) {
        clearInterval(this.helpMessageInterval);
      }
      const helpMessage = document.getElementById('helpMessage');
      if (helpMessage) {
        helpMessage.classList.add('show');
      }
    }
  }

  onWhatsAppMouseLeave(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.mouseLeaveTimeout = setTimeout(() => {
        const helpMessage = document.getElementById('helpMessage');
        if (helpMessage) {
          helpMessage.classList.remove('show');
        }
        this.startHelpMessageCycle();
      }, 2000);
    }
  }
}
