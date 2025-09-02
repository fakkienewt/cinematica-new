export interface Series {
    index: number;
    poster: string | null;
    url: string | null;
    title: string;
    rating: string;
    year: string;
    description: string;
    genres: string[];
    countries: string[];
    director: string[];
    actors: string[];
    time: string;
    premiere: string;
    episodes: number;
    seasons: number;
    script: string[];
}