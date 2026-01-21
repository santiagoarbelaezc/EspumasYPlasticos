
import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faWhatsapp, faInstagram, faFacebookF, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { VideoService } from '../../services/video.service';

@Component({
  selector: 'app-whatsapp',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './whatsapp.component.html',
  styleUrls: ['./whatsapp.component.css']
})
export class WhatsappComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoElement') videoElementRef!: ElementRef<HTMLVideoElement>;
  private intersectionObserver?: IntersectionObserver;
  videoPausedManually = false;

  constructor(library: FaIconLibrary, public videoService: VideoService) {
    library.addIcons(faWhatsapp, faInstagram, faFacebookF, faTiktok);
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  private setupIntersectionObserver(): void {
    if (!this.videoElementRef) return;
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting && !this.videoPausedManually) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        } else if (!entry.isIntersecting) {
          video.pause();
          video.currentTime = 0;
        }
      });
    }, { threshold: 0.1, rootMargin: '50px' });
    this.intersectionObserver.observe(this.videoElementRef.nativeElement);
  }

  handlePlayVideo(): void {
    if (this.videoElementRef) {
      this.videoElementRef.nativeElement.currentTime = 0;
      const playPromise = this.videoElementRef.nativeElement.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.videoPausedManually = false;
        }).catch(() => {});
      }
    }
  }

  handleVideoPause(): void {
    this.videoPausedManually = true;
  }

  isVideoPlaying(): boolean {
    return !this.videoPausedManually;
  }

  getVideoUrl(): string {
    return this.videoService.getVideoUrl('plasticos');
  }
}
