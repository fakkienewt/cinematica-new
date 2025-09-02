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

function filterRussianContent(items) {
    return items.filter(item => {
        return !item.countries ||
            !item.countries.some(country =>
                country.toLowerCase().includes('россия') ||
                country.toLowerCase().includes('ссср')
            );
    });
}

async function parseNewMovies() {
    try {
        const url = 'https://w140.zona.plus/';
        const response = await axios.get(url, axiosConfig);
        const $ = cheerio.load(response.data);
        const movies = [];

        const items = $('.popularMovies .item').slice(0, 6);

        for (let i = 0; i < items.length; i++) {
            const element = items[i];
            const $el = $(element);

            const poster = $el.find('.cover').css('background-image');
            const movieUrl = $el.find('a').attr('href');
            const title = $el.find('.title').text().trim();

            const ratingText = $el.find('.rating').text().trim();
            const rating = ratingText ? parseFloat(ratingText) : 0;

            const yearText = $el.find('.year').text().trim();
            const year = yearText ? parseInt(yearText) : 2025;

            let description = '';
            let genres = [];
            let countries = [];
            let director = [];
            let actors = [];
            let time = '';
            let premiere = '';
            let script = [];

            if (movieUrl) {
                try {
                    const fullUrl = `https://w140.zona.plus${movieUrl}`;
                    const descResponse = await axios.get(fullUrl, axiosConfig);
                    const desc$ = cheerio.load(descResponse.data);

                    description = desc$('.entity-desc-description').text().trim();

                    desc$('.entity-desc-item-wrap').each((index, item) => {
                        const $item = desc$(item);
                        const label = $item.find('.entity-desc-item').text().trim();

                        if (label === 'Жанры') {
                            genres = $item.find('.entity-desc-link-u')
                                .slice(0, 3)
                                .map((i, el) => desc$(el).text().trim())
                                .get();
                        }

                        if (label === 'Страна' || label === 'Страны') {
                            countries = $item.find('.entity-desc-link-u')
                                .map((i, el) => desc$(el).text().trim())
                                .get();
                        }
                    });

                    director = desc$('.entity-desc-item:contains("Режиссёр") + .entity-desc-value span[itemprop="name"]')
                        .map((i, el) => desc$(el).text().trim())
                        .get();

                    actors = desc$('.entity-desc-item:contains("Актёры") + .entity-desc-value span[itemprop="name"]')
                        .slice(0, 5)
                        .map((i, el) => desc$(el).text().trim())
                        .get();

                    time = desc$('.entity-desc-item:contains("Время") + .entity-desc-value time').text().trim();

                    const premiereBlock = desc$('.entity-desc-item:contains("Премьера") + .entity-desc-value');
                    if (premiereBlock.length) {
                        const worldPremiere = premiereBlock.find('span').first().text().trim();
                        premiere = worldPremiere.split('в мире')[0].trim();
                    }

                    script = desc$('.js-scenarist span[itemprop="name"]')
                        .map((i, el) => desc$(el).text().trim())
                        .get();

                } catch (error) {
                    console.log('Ошибка:', error.message);
                }
            }

            movies.push({
                index: i,
                poster: poster,
                url: movieUrl ? `https://w140.zona.plus${movieUrl}` : null,
                title: title,
                rating: rating,
                year: year,
                description: description,
                genres: genres,
                countries: countries,
                director: director,
                actors: actors,
                time: time,
                premiere: premiere,
                script: script
            });
        }

        return filterRussianContent(movies);

    } catch (error) {
        console.error('Ошибка:', error.message);
        throw error;
    }
}

async function parseOnlyFilms() {
    try {
        const url = 'https://w140.zona.plus/movies';
        const response = await axios.get(url, axiosConfig);
        const $ = cheerio.load(response.data);
        const films = [];

        const items = $('.results-item-wrap').slice(0, 28);

        for (let i = 0; i < items.length; i++) {
            const element = items[i];
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

            const ratingText = $el.find('.results-item-rating span').text().trim();
            const rating = ratingText ? parseFloat(ratingText) : 0;

            const yearText = $el.find('.results-item-year').text().trim();
            const year = yearText ? parseInt(yearText) : 2025;

            let description = '';
            let genres = [];
            let countries = [];
            let director = [];
            let actors = [];
            let time = '';
            let premiere = '';
            let script = [];

            if (url) {
                try {
                    const fullUrl = `https://w140.zona.plus${url}`;
                    const descResponse = await axios.get(fullUrl, axiosConfig);
                    const desc$ = cheerio.load(descResponse.data);

                    description = desc$('.entity-desc-description').text().trim();

                    desc$('.entity-desc-item-wrap').each((index, item) => {
                        const $item = desc$(item);
                        const label = $item.find('.entity-desc-item').text().trim();

                        if (label === 'Жанры') {
                            genres = $item.find('.entity-desc-link-u')
                                .slice(0, 3)
                                .map((i, el) => desc$(el).text().trim())
                                .get();
                        }

                        if (label === 'Страна' || label === 'Страны') {
                            countries = $item.find('.entity-desc-link-u')
                                .map((i, el) => desc$(el).text().trim())
                                .get();
                        }
                    });
                    director = desc$('.entity-desc-item:contains("Режиссёр") + .entity-desc-value span[itemprop="name"]')
                        .map((i, el) => desc$(el).text().trim())
                        .get();

                    actors = desc$('.entity-desc-item:contains("Актёры") + .entity-desc-value span[itemprop="name"]')
                        .slice(0, 5)
                        .map((i, el) => desc$(el).text().trim())
                        .get();

                    time = desc$('.entity-desc-item:contains("Время") + .entity-desc-value time').text().trim();

                    const premiereBlock = desc$('.entity-desc-item:contains("Премьера") + .entity-desc-value');
                    if (premiereBlock.length) {
                        const worldPremiere = premiereBlock.find('span').first().text().trim();
                        premiere = worldPremiere.split('в мире')[0].trim();
                    }

                    script = desc$('.js-scenarist span[itemprop="name"]')
                        .map((i, el) => desc$(el).text().trim())
                        .get();

                } catch (error) {
                    console.log('Ошибка:', error.message);
                }
            }

            films.push({
                index: i,
                poster: poster,
                url: url ? `https://w140.zona.plus${url}` : null,
                title: title,
                rating: rating,
                year: year,
                description: description,
                genres: genres,
                countries: countries,
                director: director,
                actors: actors,
                time: time,
                premiere: premiere,
                script: script
            });
        }

        return filterRussianContent(films);

    } catch (error) {
        console.log('Ошибка:', error.message);
        throw error;
    }
}

async function parseSeries() {
    try {
        const url = 'https://w140.zona.plus/tvseries';
        const response = await axios.get(url, axiosConfig);
        const $ = cheerio.load(response.data);

        const series = [];

        const items = $('.results-item-wrap').slice(0, 28);

        for (let i = 0; i < items.length; i++) {
            const element = items[i];
            const $el = $(element);

            const title = $el.find('.results-item-title').text();
            const url = $el.find('.results-item').attr('href');

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

            let description = '';
            let genres = [];
            let countries = [];
            let director = [];
            let actors = [];
            let time = '';
            let premiere = '';
            let episodes = 0;
            let seasons = 0;
            let script = [];

            if (url) {
                try {
                    const fullUrl = `https://w140.zona.plus${url}`;
                    const descResponse = await axios.get(fullUrl, axiosConfig);
                    const desc$ = cheerio.load(descResponse.data);

                    description = desc$('.entity-desc-description').text().trim();

                    desc$('.entity-desc-item-wrap').each((index, item) => {
                        const $item = desc$(item);
                        const label = $item.find('.entity-desc-item').text().trim();

                        if (label === 'Жанры') {
                            genres = $item.find('.entity-desc-link-u')
                                .map((i, el) => desc$(el).text().trim())
                                .get()
                                .slice(0, 4);
                        }

                        if (label === 'Страна' || label === 'Страны') {
                            countries = $item.find('.entity-desc-link-u')
                                .map((i, el) => desc$(el).text().trim())
                                .get();
                        }
                    });

                    director = desc$('.entity-desc-item:contains("Режиссёр") + .entity-desc-value span[itemprop="name"]')
                        .map((i, el) => desc$(el).text().trim())
                        .get()
                        .slice(0, 7);

                    actors = desc$('.entity-desc-item:contains("Актёры") + .entity-desc-value span[itemprop="name"]')
                        .map((i, el) => desc$(el).text().trim())
                        .get()
                        .slice(0, 7);

                    script = desc$('.js-scenarist span[itemprop="name"]')
                        .map((i, el) => desc$(el).text().trim())
                        .get()
                        .slice(0, 7);

                    time = desc$('.entity-desc-item:contains("Время") + .entity-desc-value time').text().trim();

                    const premiereBlock = desc$('.entity-desc-item:contains("Премьера") + .entity-desc-value');
                    if (premiereBlock.length) {
                        const worldPremiere = premiereBlock.find('span').first().text().trim();
                        premiere = worldPremiere.split('в мире')[0].trim();
                    }

                    seasons = desc$('.entity-season.js-entity-season').length;

                    if (seasons === 0) {
                        seasons = 1;
                    }

                    episodes = desc$('.items.episodes.is-entity-page .item').length;

                    if (episodes === 0) {
                        episodes = desc$('.items.episodes .item').length;
                    }

                } catch (error) {
                    console.log('Ошибка:', error.message);
                }
            }

            series.push({
                index: i,
                poster: poster,
                url: url ? `https://w140.zona.plus${url}` : null,
                title: title,
                rating: rating,
                year: year,
                description: description,
                genres: genres,
                countries: countries,
                director: director,
                actors: actors,
                time: time,
                premiere: premiere,
                episodes: episodes,
                seasons: seasons,
                script: script
            });
        }

        return filterRussianContent(series);

    } catch (error) {
        console.log('Ошибка:', error.message);
        throw error;
    }
}

async function parseCatoons() {
    try {
        const url = 'https://w140.zona.plus/tvseries/filter/genre-multfilm';
        const response = await axios.get(url, axiosConfig);
        const $ = cheerio.load(response.data);

        const cartoons = [];

        const items = $('.results-item-wrap').slice(0, 28);

        for (let i = 0; i < items.length; i++) {
            const element = items[i];
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

            let description = '';
            let genres = [];
            let countries = [];

            if (url) {
                try {
                    const fullUrl = `https://w140.zona.plus${url}`;
                    const descResponse = await axios.get(fullUrl, axiosConfig);
                    const desc$ = cheerio.load(descResponse.data);

                    description = desc$('.pb-3').text().trim();

                    desc$('.entity-desc-item-wrap').each((index, item) => {
                        const $item = desc$(item);
                        const label = $item.find('.entity-desc-item').text().trim();

                        if (label === 'Жанры') {
                            genres = $item.find('.entity-desc-link-u')
                                .map((i, el) => desc$(el).text().trim())
                                .get();
                        }

                        if (label === 'Страна' || label === 'Страны') {
                            countries = $item.find('.entity-desc-link-u')
                                .map((i, el) => desc$(el).text().trim())
                                .get();
                        }
                    });

                } catch (error) {
                    console.log('Ошибка:', error.message);
                }
            }

            cartoons.push({
                index: i,
                poster: poster,
                url: url ? `https://w140.zona.plus${url}` : null,
                title: title,
                rating: rating,
                year: year,
                description: description,
                genres: genres,
                countries: countries
            });
        }

        return filterRussianContent(cartoons);

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

        $('.animes-list-item').each((index, element) => {
            const $el = $(element);

            const title = $el.find('.h5.font-weight-normal a').text();
            const url = 'https://animego.me' + $el.find('.h5.font-weight-normal a').attr('href');
            const poster = $el.find('.anime-list-lazy').attr('data-original');
            const rating = $el.find('.p-rate-flag__text').text().trim();
            const year = $el.find('.anime-year a').text().trim();
            const description = $el.find('.description').text();

            anime.push({
                id: index,
                title: title,
                url: url,
                poster: poster,
                rating: rating,
                year: year,
                description: description
            });
        });

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

        const newsElements = $('.redesign_topic').slice(0, 27);

        for (let index = 0; index < newsElements.length; index++) {
            const element = newsElements[index];
            const $el = $(element);

            const title = $el.find('strong a').text().trim();
            const newsUrl = $el.find('strong a').attr('href');
            const poster = $el.find('.wrapper_block_stack img').attr('src');
            const when = $el.find('.redesign_topic_main').contents().last().text().trim();

            let description = '';

            try {
                if (newsUrl) {
                    const fullUrl = `https://www.film.ru${newsUrl}`;

                    const descResponse = await axios.get(fullUrl, axiosConfig);
                    const desc$ = cheerio.load(descResponse.data);

                    description = desc$('.wrapper_articles_text p').map((i, p) =>
                        desc$(p).text().trim()
                    ).get();
                }
            } catch (error) {
                console.log(`Ошибка: ${error.message}`);
            }

            news.push({
                id: index,
                title: title,
                url: `https://www.film.ru${newsUrl}`,
                poster: poster ? `https://www.film.ru${poster}` : '',
                when: when,
                description: description
            });
        }

        return news;

    } catch (error) {
        console.log('Ошибка:', error);
        throw error;
    }
}

app.get('/api/movies', async (req, res) => {
    try {
        const movies = await parseNewMovies();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка' });
    }
});

app.get('/api/only_movies', async (req, res) => {
    try {
        const films = await parseOnlyFilms();
        res.json(films);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка' });
    }
});

app.get('/api/series', async (req, res) => {
    try {
        const series = await parseSeries();
        res.json(series);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка' });
    }
});

app.get('/api/cartoons', async (req, res) => {
    try {
        const cartoons = await parseCatoons();
        res.json(cartoons);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка' });
    }
});

app.get('/api/anime', async (req, res) => {
    try {
        const anime = await parseAnime();
        res.json(anime);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка' });
    }
});

app.get('/api/news', async (req, res) => {
    try {
        const news = await parseNews();
        res.json(news);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});