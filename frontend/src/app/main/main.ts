import { Component, OnInit } from '@angular/core';
import { Movie } from './movie.model';
import { Service } from '../services/service';

@Component({
  selector: 'app-main',
  standalone: false,
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main implements OnInit {

  movies: Movie[] = [];
  error = false;
  loading = true;

  constructor(private service: Service) { }

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.service.getMovies().subscribe({
      next: (data) => {
        this.movies = data;
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
        this.error = true;
      }
    });
  }

  getPosterUrl(poster: string): string {
    if (!poster) return '';
    const match = poster.match(/url\(["']?(.*?)["']?\)/);
    return match ? match[1] : '';
  }
}
