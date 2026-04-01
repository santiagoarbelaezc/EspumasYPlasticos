import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-banner.html',
  styleUrl: './video-banner.css'
})
export class VideoBanner implements AfterViewInit, OnDestroy {
  @Input() videoSrc: string = '';
  @Input() titulo: string = '';
  @Input() subtitulo: string = '';
  @Input() logoSrc: string = 'assets/img/logo-grande.png';

  showOverlay = false;
  isPlaying = false;
  private showTimeout: any;
  private hideTimeout: any;
  private videoPlayAttempted = false;
  private timeUpdateListener: any;
  private intersectionObserver?: IntersectionObserver;

  @ViewChild('heroVideo', { static: true }) heroVideo!: ElementRef<HTMLVideoElement>;

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit() {
    const video = this.heroVideo.nativeElement;

    this.showOverlay = true;
    this.cdr.detectChanges();

    if (!this.videoPlayAttempted) {
      this.videoPlayAttempted = true;
      // Ya no hacemos autoplay al iniciar, mostramos overlay.
    }

    // Configurar Intersection Observer para pausar el video si sale del viewport
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && !video.paused) {
          video.pause();
          this.isPlaying = false;
          this.showOverlay = true;
          this.cdr.detectChanges();
        }
      });
    }, { threshold: 0.1 });

    this.intersectionObserver.observe(video);

    video.addEventListener('playing', () => {
      this.isPlaying = true;
      this.cdr.detectChanges();
    });

    video.addEventListener('pause', () => {
      this.isPlaying = false;
      this.cdr.detectChanges();
    });

    this.timeUpdateListener = () => {
      if (video.duration && video.currentTime >= video.duration - 0.5) {
        if (!this.showOverlay) {
          this.showOverlay = true;
          this.cdr.detectChanges();
        }
      }
    };
    video.addEventListener('timeupdate', this.timeUpdateListener);

    video.addEventListener('ended', () => {
      this.isPlaying = false;
      this.showOverlay = true;
      this.clearTimeouts();
      this.cdr.detectChanges();
    });

    video.addEventListener('seeked', () => {
      if (video.currentTime < 1 && this.showOverlay) {
        this.hideTimeout = setTimeout(() => {
          this.showOverlay = false;
          this.cdr.detectChanges();
        }, 3000);
      }
    });
  }

  private scheduleOverlay(): void {
    this.clearTimeouts();

    this.showTimeout = setTimeout(() => {
      this.showOverlay = true;
      this.cdr.detectChanges();

      this.hideTimeout = setTimeout(() => {
        this.showOverlay = false;
        this.cdr.detectChanges();
      }, 5000);

    }, 5000);
  }

  onVideoLoaded() {
    this.isPlaying = false;
    this.showOverlay = true;
    this.cdr.detectChanges();
  }

  playVideo() {
    const video = this.heroVideo.nativeElement;
    video.currentTime = 0;
    video.play().then(() => {
      this.isPlaying = true;
      this.showOverlay = false;
      this.clearTimeouts();
      this.scheduleOverlay();
      this.cdr.detectChanges();
    }).catch(err => console.log('Error al reproducir:', err));
  }

  ngOnDestroy() {
    this.clearTimeouts();
    const video = this.heroVideo?.nativeElement;
    if (video && this.timeUpdateListener) {
      video.removeEventListener('timeupdate', this.timeUpdateListener);
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  private clearTimeouts() {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }
}
