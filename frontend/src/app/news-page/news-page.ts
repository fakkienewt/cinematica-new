import { Component, OnInit } from '@angular/core';
import { News } from '../models/news.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news-page',
  standalone: false,
  templateUrl: './news-page.html',
  styleUrl: './news-page.scss'
})
export class NewsPage implements OnInit {
  news: News | null = null;
  error: boolean = false;

  constructor(
    public router: Router
  ) { }

  ngOnInit(): void {
    const navigation = window.history.state;
    if (navigation && navigation.news) {
      this.news = navigation.news;
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
