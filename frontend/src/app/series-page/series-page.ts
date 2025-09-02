import { Component, OnInit } from '@angular/core';
import { Series } from '../models/series.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-series-page',
  standalone: false,
  templateUrl: './series-page.html',
  styleUrl: './series-page.scss'
})
export class SeriesPage implements OnInit {

  series: Series | null = null
  error = false;

  constructor(
    public router: Router
  ) { }

  ngOnInit(): void {
    const navigation = window.history.state;
    if (navigation && navigation.series) {
      this.series = navigation.series;
    } else {
      this.error = true;
    }
  }

  getPosterUrl(poster: string | null | undefined): string {
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
