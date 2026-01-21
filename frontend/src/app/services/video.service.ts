import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  /**
   * Devuelve la URL absoluta del video dado su nombre (sin extensión)
   */
  getVideoUrl(videoId: string): string {
    // Asume que los videos están en /public/videos/ y son .mp4
    return `assets/videos/${videoId}.mp4`;
  }
}
