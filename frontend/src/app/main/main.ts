import { Component, OnInit } from '@angular/core';
import { Movie } from './movie.model';
import { Service } from '../services/service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: false,
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main implements OnInit {
  movies: Movie[] = [];
  films: Movie[] = [];
  seriesList: Movie[] = [];
  cartoons: Movie[] = [];
  anime: Movie[] = [];
  collections: Movie[] = [];

  error = false;
  loading = true;
  activeTab: string = 'films';

  constructor(
    private filmService: Service,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.loadMovies();
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
        this.loadFilms();
        break;
      case 'series':
        this.loadSeries();
        break;
      case 'cartoons':
        this.loadCartoons();
        break;
      case 'anime':
        this.loadAnime();
        break;
      case 'news':
        this.loadNews();
        break;
    }
  }

  loadMovies(): void {
    this.filmService.getNewMovies().subscribe({
      next: (data: Movie[]) => {
        this.movies = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.log('Ошибка загрузки:', error);
        this.loading = false;
        this.error = true;
      }
    });
  }

  loadFilms(): void {
    this.filmService.getFilms().subscribe({
      next: (data: Movie[]) => {
        this.films = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.log('Ошибка загрузки:', error);
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
      },
      error: (error: any) => {
        console.log('Ошибка загрузки:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadCartoons(): void {
    this.filmService.getCartoons().subscribe({
      next: (data: Movie[]) => {
        this.cartoons = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.log('Ошибка загрузки:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadAnime(): void {
    this.filmService.getAnime().subscribe({
      next: (data: Movie[]) => {
        this.anime = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.log('Ошибка загрузки аниме:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadNews(): void {
    this.collections = [];
    this.loading = false;
  }

  getPosterUrl(poster: string): string {
    if (!poster) return '/assets/default-poster.jpg';
    const match = poster.match(/url\(["']?(.*?)["']?\)/);
    return match ? match[1] : '/assets/default-poster.jpg';
  }

  getPosterUrlFilm(poster: string): string {
    if (!poster) return '/assets/default-poster.jpg';
    const cleanPoster = poster.split(',')[0].trim();
    return cleanPoster.startsWith('http') ? cleanPoster : '/assets/default-poster.jpg';
  }

  onClickPage(movie: Movie) {
    this.router.navigate([`movie/${movie.index}`], {
      state: { movie: movie }
    });
  }

  onClickPageFilm(film: Movie) {
    this.router.navigate([`only_movies/${film.index}`], {
      state: { movie: film }
    });
  }

  onClickPageSeries(series: Movie) {
    this.router.navigate([`series/${series.index}`], {
      state: { movie: series }
    });
  }

  onClickPageCartoons(cartoon: Movie) {
    this.router.navigate([`cartoons/${cartoon.index}`], {
      state: { movie: cartoon}
    });
  }
}
