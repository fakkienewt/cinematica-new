export interface Series {
    index: number;
    poster: string | null;
    url: string | null;
    title: string;
    rating: string;
    year: string;
    description: string;
    genres: string[];
    premiere: string;
    episodes: number;
    countries: string[];
    actors?: string[];
    director?: string[];
    author?: string[];
}