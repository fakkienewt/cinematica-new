import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../main/movie.model';

@Injectable({
    providedIn: 'root'
})
export class Service {
    private apiUrl = 'http://localhost:3000/api/movies';

    constructor(private http: HttpClient) { }

    getMovies(): Observable<Movie[]> {
        return this.http.get<Movie[]>(this.apiUrl);
    }
}