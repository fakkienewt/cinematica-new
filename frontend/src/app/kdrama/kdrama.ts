import { Component, OnInit } from '@angular/core';
import { KdramaModel } from '../models/kdrama.model';

@Component({
  selector: 'app-kdrama',
  standalone: false,
  templateUrl: './kdrama.html',
  styleUrl: './kdrama.scss'
})
export class Kdrama implements OnInit {

  error: boolean = false;
  kdrama: KdramaModel | null = null;

  ngOnInit(): void {
    const navigation = window.history.state;
    if (navigation && navigation.kdrama) {
      this.kdrama = navigation.kdrama;
    } else {
      this.error = true;
    }
  }

  getPosterUrl(poster: string | undefined): string {
    if (!poster) return '/assets/default-poster.jpg';
    let cleanPoster = poster.replace(/^['"]|['"]$/g, '').trim();
    const bgMatch = cleanPoster.match(/url\(['"]?(.*?)['"]?\)/);
    if (bgMatch && bgMatch[1]) {
      cleanPoster = bgMatch[1];
    }
    cleanPoster = cleanPoster.split(',')[0].trim();
    if (cleanPoster.startsWith('http')) {
      return cleanPoster;
    }
    return '/assets/default-poster.jpg';
  }
}
