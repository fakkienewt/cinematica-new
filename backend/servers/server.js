const express = require('express');
const cors = require('cors');
const cheerio = require('cheerio');
const axios = require('axios');

const app = express();
const PORT = 3500;

app.use(cors({
    origin: 'http://localhost:4200'
}));
app.use(express.json());

const axiosConfig = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
    }
};

async function parseNewMovies() {
    try {
        const url = 'https://w140.zona.plus/';
        const response = await axios.get(url, axiosConfig);
        const $ = cheerio.load(response.data);
        const movies = [];

        $('.popularMovies .item').each((index, element) => {
            const $el = $(element);

            const poster = $el.find('.cover').css('background-image');
            const movieUrl = $el.find('a').attr('href');
            const title = $el.find('.title').text().trim();

            const ratingText = $el.find('.rating').text().trim();
            const rating = ratingText ? parseFloat(ratingText) : 0;

            const yearText = $el.find('.year').text().trim();
            const year = yearText ? parseInt(yearText) : 2025;

            movies.push({
                index: index,
                poster: poster,
                url: movieUrl ? `https://w140.zona.plus${movieUrl}` : null,
                title: title,
                rating: rating,
                year: year
            });
        });
        return movies.slice(0, 6);

    } catch (error) {
        console.error('Ошибка новых фильмов:', error.message);
        throw error;
    }
}

async function parseOnlyFilms() {
    try {
        const url = 'https://w140.zona.plus/movies';
        const response = await axios.get(url, axiosConfig);
        const $ = cheerio.load(response.data);
        const films = [];

        $('.results-item-wrap').each((index, element) => {
            const $el = $(element);

            const title = $el.find('.results-item-title').text().trim();
            const url = $el.find('.results-item').attr('href');

            const posterStyle = $el.find('.result-item-preview').css('background-image');
            let poster = null;

            if (posterStyle) {
                const matches = posterStyle.match(/url\(['"]?(.*?)['"]?\)/);
                if (matches && matches[1]) {
                    poster = matches[1].split(',')[0];
                }
            }

            const rating = $el.find('.results-item-rating span').text().trim();
            const year = $el.find('.results-item-year').text().trim();

            films.push({
                index: index,
                title: title,
                url: url ? `https://w140.zona.plus${url}` : null,
                poster: poster,
                rating: rating || '',
                year: year || ''
            });
        });

        console.log('Распарсено фильмов:', films.length);
        return films.slice(0, 28);
    } catch (error) {
        console.error('Ошибка фильмов:', error.message);
        throw error;
    }
}

async function parseSeries() {
    try {
        const url = 'https://w140.zona.plus/tvseries';
        const response = await axios.get(url, axiosConfig);
        const $ = cheerio.load(response.data);
        const series = [];

        $('.results-item-wrap').each((index, element) => {
            const $el = $(element);

            const title = $el.find('.results-item-title').text();
            let url = $el.find('.results-item').attr('href');

            const posterStyle = $el.find('.result-item-preview').css('background-image');
            let poster = null;

            if (posterStyle) {
                const matches = posterStyle.match(/url\(['"]?(.*?)['"]?\)/);
                if (matches && matches[1]) {
                    poster = matches[1].split(',')[0];
                }
            }

            const rating = $el.find('.results-item-rating span').text();
            const year = $el.find('.results-item-year').text();

            series.push({
                index: index,
                title: title,
                url: url ? `https://w140.zona.plus${url}` : null,
                poster: poster,
                rating: rating || '',
                year: year || ''
            });
        });

        console.log('Найдено сериалов:', series.length);
        return series.slice(0, 28);

    } catch (error) {
        console.error('Ошибка сериалов:', error.message);
        throw error;
    }
}

async function parseCatoons() {
    try {
        const url = 'https://w140.zona.plus/tvseries/filter/genre-multfilm';
        const response = await axios.get(url, axiosConfig);
        const $ = cheerio.load(response.data);

        const cartoons = [];

        $('.results-item-wrap').each((index, element) => {
            const $el = $(element);

            const title = $el.find('.results-item-title').text();
            const url = $el.find('.results-item').attr('href');

            const posterStyle = $el.find('.result-item-preview').css('background-image');
            let poster = null;

            if (posterStyle) {
                const matches = posterStyle.match(/url\(['"]?(.*?)['"]?\)/);
                if (matches && matches[1]) {
                    poster = matches[1].split(',')[0].trim();
                }
            }
            const rating = $el.find('.results-item-rating span').text();
            const year = $el.find('.results-item-year').text();

            cartoons.push({
                index: index,
                title: title,
                url: url ? `https://w140.zona.plus${url}` : null,
                poster: poster,
                rating: rating || '',
                year: year || ''
            });
        });

        console.log('Найдено сериалов:', cartoons.length);
        return cartoons.slice(0, 28);

    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function parseAnime() {
    try {
        const url = 'https://animego.me/anime?sort=r.rating&direction=desc';
        const response = await axios.get(url, axiosConfig);
        const $ = cheerio.load(response.data);

        const anime = [];

        $('.animes-list-item').each((index, elemnt) => {
            const $el = $(elemnt);

            const title = $el.find('.h5.font-weight-normal a').text();
            const url = 'https://animego.me' + $el.find('.h5.font-weight-normal a').attr('href');
            const poster = $el.find('.anime-list-lazy').attr('data-original');
            const rating = $el.find('.p-rate-flag__text').text().trim();
            const year = $el.find('.anime-year a').text().trim();

            anime.push({
                id: index,
                title: title,
                url: url,
                poster: poster,
                rating: rating,
                year: year
            })
        });

        console.log(anime);
        console.log('Найдено аниме:', anime.length);
        return anime.slice(0, 28);

    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function parseNews() {
    try {
        const url = 'https://www.film.ru/topic/news';
        const response = await axios.get(url, axiosConfig);
        const $ = cheerio.load(response.data);

        const news = [];

        $('.redesign_topic').each((index, element) => {
            const $el = $(element);

            const title = $el.find('strong').attr('a');
            const url = $el.find('a').attr('href');
            const poster = $el.find('.wrapper_block_stack var img').attr('src');
            const when = $el.find('.redesign_topic_main').attr('a').text();

            news.push({
                id: index,
                title: title,
                url: url,
                poster: poster,
                when: when
            });
        });

        console.log(news);
        console.log('Найдено новостей:', news.length); 
        return news.slice(0, 28);


    } catch (error) {
        console.log(error);
        throw error;
    }
}

app.get('/api/movies', async (req, res) => {
    try {
        const movies = await parseNewMovies();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении новых фильмов' });
    }
});

app.get('/api/only_movies', async (req, res) => {
    try {
        const films = await parseOnlyFilms();
        res.json(films);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении фильмов' });
    }
});

app.get('/api/series', async (req, res) => {
    try {
        const series = await parseSeries();
        res.json(series);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении сериалов' });
    }
});

app.get('/api/cartoons', async (req, res) => {
    try {
        const cartoons = await parseCatoons();
        res.json(cartoons);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении новых фильмов' });
    }
});

app.get('/api/anime', async (req, res) => {
    try {
        const anime = await parseAnime();
        res.json(anime);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении новых фильмов' });
    }
});

app.get('/api/news', async (req, res) => {
    try {
        const news = await parseNews();
        res.json(news);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении новых фильмов' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});