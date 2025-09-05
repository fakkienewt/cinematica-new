import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../main/movie.model';
import { News } from '../models/news.model';
import { KdramaModel } from '../models/kdrama.model';
import { AnimeModel } from '../models/anime.model';

@Injectable({
    providedIn: 'root'
})
export class Service {
    private baseUrl = 'http://localhost:3500/api';

    constructor(private http: HttpClient) { }

    getNewMovies(): Observable<Movie[]> {
        return this.http.get<Movie[]>(`${this.baseUrl}/movies`);
    }

    getFilms(): Observable<Movie[]> {
        return this.http.get<Movie[]>(`${this.baseUrl}/only_movies`);
    }

    getSeries(): Observable<Movie[]> {
        return this.http.get<Movie[]>(`${this.baseUrl}/series`);
    }

    getKdrama(): Observable<KdramaModel[]> {
        return this.http.get<KdramaModel[]>(`${this.baseUrl}/kdrama`);
    }

    getAnime(): Observable<AnimeModel[]> {
        return this.http.get<AnimeModel[]>(`${this.baseUrl}/anime`);
    }

    getNews(): Observable<News[]> {
        return this.http.get<News[]>(`${this.baseUrl}/news`);
    }
}