import { Component, OnInit } from '@angular/core';
import { Movie } from '../main/movie.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page',
  standalone: false,
  templateUrl: './page.html',
  styleUrl: './page.scss'
})
export class Page implements OnInit {

  movie: Movie | null = null;
  error: boolean = false;

  constructor(
    public router: Router
  ) { }

  ngOnInit(): void {
    const navigation = window.history.state;
    if (navigation && navigation.movie) {
      this.movie = navigation.movie;
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

  get genres(): string[] {
    return this.movie?.genres || [];
  }

  get countries(): string[] {
    return this.movie?.countries || [];
  }

}
