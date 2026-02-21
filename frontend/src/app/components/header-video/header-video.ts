import { Component } from '@angular/core';
import { VideoBanner } from '../video-banner/video-banner';

@Component({
  selector: 'app-header-video',
  standalone: true,
  imports: [VideoBanner],
  templateUrl: './header-video.html',
  styleUrl: './header-video.css',
})
export class HeaderVideo {

}
