const express = require('express');
const cors = require('cors');
const cheerio = require('cheerio');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

async function parseNewMovies() {
    try {
        const url = 'https://w140.zona.plus/';
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive'
            }
        });
        const $ = cheerio.load(response.data);
        const movies = [];

        $('.popularMovies .item').each((index, element) => {
            const $el = $(element);

            const poster = $el.find('.cover').css('background-image');
            const movieUrl = $el.find('a').attr('href');

            movies.push({
                index: index,
                poster: poster,
                url: movieUrl ? `https://w140.zona.plus${movieUrl}` : null,
            });
        });
        return movies.slice(0, 6);

    } catch (error) {
        console.error('Ошибка при парсинге:', error.message);
        throw error;
    }
}

app.get('/api/movies', async (req, res) => {
    try {
        const movies = await parseNewMovies();
        res.json(movies);

    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении данных' });
    }
});


app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});


