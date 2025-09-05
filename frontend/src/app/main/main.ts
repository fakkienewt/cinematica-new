import { Component, OnInit } from '@angular/core';
import { Movie } from './movie.model';
import { Service } from '../services/service';
import { Router } from '@angular/router';
import { News } from '../models/news.model';
import { KdramaModel } from '../models/kdrama.model';
import { AnimeModel } from '../models/anime.model';

@Component({
  selector: 'app-main',
  standalone: false,
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main implements OnInit {
  films: Movie[] = [];
  seriesList: Movie[] = [];
  kdrama: KdramaModel[] = [];
  anime: AnimeModel[] = [];
  news: News[] = [];

  error = false;
  loading = true;
  activeTab: string = 'films';

  loadingFilms = true;
  loadingSeries = true;
  loadingKdrama = true;
  loadingAnime = true;
  loadingNews = true;

  constructor(
    private filmService: Service,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.setActiveTab('films');
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.loadCategoryData(tab);
  }

  loadCategoryData(category: string): void {
    this.loading = true;
    this.error = false;

    switch (category) {
      case 'films':
        if (this.films.length === 0) {
          this.loadFilms();
        }
        break;
      case 'series':
        if (this.seriesList.length === 0) {
          this.loadSeries();
        }
        break;
      case 'kdrama':
        if (this.kdrama.length === 0) {
          this.loadKdrama();
        }
        break;
      case 'anime':
        if (this.anime.length === 0) {
          this.loadAnime();
        }
        break;
      case 'news':
        if (this.news.length === 0) {
          this.loadNews();
        }
        break;
    }
  }

  loadFilms(): void {
    this.filmService.getFilms().subscribe({
      next: (data: Movie[]) => {
        this.films = data;
        this.loading = false;
        this.loadingFilms = false;
      },
      error: (error: any) => {
        console.log('Ошибка:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadSeries(): void {
    this.filmService.getSeries().subscribe({
      next: (data: Movie[]) => {
        this.seriesList = data;
        this.loading = false;
        this.loadingSeries = false;
      },
      error: (error: any) => {
        console.log('Ошибка:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadKdrama(): void {
    this.filmService.getKdrama().subscribe({
      next: (data: KdramaModel[]) => {
        this.kdrama = data;
        this.loading = false;
        this.loadingKdrama = false;
      },
      error: (error: any) => {
        console.log('Ошибка:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadAnime(): void {
    this.filmService.getAnime().subscribe({
      next: (data: AnimeModel[]) => {
        this.anime = data;
        this.loading = false;
        this.loadingAnime = false;
      },
      error: (error: any) => {
        console.log('Ошибка:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadNews(): void {
    this.filmService.getNews().subscribe({
      next: (data: News[]) => {
        this.news = data;
        this.loading = false;
        this.loadingNews = false;
      },
      error: (error: any) => {
        console.log('Ошибка:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  getPosterUrlFilm(poster: string): string {
    if (!poster) return '/assets/default-poster.jpg';
    const cleanPoster = poster.split(',')[0].trim();
    return cleanPoster.startsWith('http') ? cleanPoster : '/assets/default-poster.jpg';
  }

  onClickPageFilm(film: Movie) {
    this.router.navigate([`only_movies/${film.index}`], {
      state: { movie: film }
    });
  }

  onClickPageSeries(series: Movie) {
    this.router.navigate([`series/${series.index}`], {
      state: { series: series }
    });
  }

  onClickPageKdrama(kdrama: KdramaModel) {
    this.router.navigate([`kdrama/${kdrama.id}`], {
      state: { kdrama: kdrama }
    });
  }
  onClickPageAnime(anime: AnimeModel) {
    this.router.navigate([`anime/${anime.id}`], {
      state: { anime: anime }
    });
  }
  onClickPageNews(n: News) {
    this.router.navigate([`news/${n.id}`], {
      state: { news: n }
    });
  }
}
