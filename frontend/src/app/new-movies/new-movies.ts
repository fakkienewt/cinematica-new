import { Component, OnInit } from '@angular/core';
import { NewMoviesService } from '../services/new-movies.service';
import { Observable, of } from 'rxjs';
import { Movie } from '../main/movie.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-movies',
  standalone: false,
  templateUrl: './new-movies.html',
  styleUrl: './new-movies.scss'
})
export class NewMovies implements OnInit {

  moviesList$: Observable<Movie[]> = of([]);
  loading$ = true;

  constructor(
    private _newMoviesService: NewMoviesService,
    public router: Router,
  ) {

  }

  ngOnInit(): void {
    this.moviesList$ = this._newMoviesService.moviesList$;
    this._newMoviesService.load();
    this._newMoviesService.loading$.subscribe(loading => {
      this.loading$ = loading;
    });
  }

  getPosterUrl(poster: string): string {
    if (!poster) return '/assets/default-poster.jpg';
    const match = poster.match(/url\(["']?(.*?)["']?\)/);
    return match ? match[1] : '/assets/default-poster.jpg';
  }

  onClickPage(movie: Movie) {
    this.router.navigate([`movie/${movie.index}`], {
      state: { movie: movie }
    });
  }
}
