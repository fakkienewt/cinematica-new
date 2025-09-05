import { BehaviorSubject, Observable } from "rxjs";
import { Movie } from "../main/movie.model";
import { Service } from "./service";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class NewMoviesService {

    private _moviesList$: BehaviorSubject<Movie[]> = new BehaviorSubject<Movie[]>([]);
    private _loading$ = new BehaviorSubject<boolean>(true);

    constructor(private _service: Service) { }

    loading$ = this._loading$.asObservable();

    load(): void {
        this._service.getNewMovies().subscribe(result => {
            this._moviesList$.next(result);
            this._loading$.next(false);
        });
    }

    get moviesList$(): Observable<Movie[]> {
        return this._moviesList$.asObservable();
    }
}