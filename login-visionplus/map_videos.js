const axios = require('axios');

// Config
const API_URL = 'https://visionplus-final-production-bb72.up.railway.app';
const ADMIN_SECRET = 'visionplus_admin';
const TMDB_API_KEY = '213094b8e75a9d685ffb81fb0a71babc';

// User's Video List
const videos = [
    { title: "Trick", bunnyId: "9f8baff1-e8a8-4c22-bef5-bc1ad337482a", year: 2019 },
    { title: "Bichos: Una aventura en miniatura", bunnyId: "95599932-65df-4412-b2da-d4afacea44b9" }, // 'bichos' -> A Bug's Life
    { title: "Project Almanac", bunnyId: "03c09688-a63d-48a1-bf0e-0723ac5b0712" }, // 'Bienvenidos al ayer'
    { title: "The Suicide Squad", bunnyId: "35857360-35a9-4af8-aaad-65dd810e5d9e", year: 2021 }, // 'El Escuadron Suicida'
    { title: "Chronicle", bunnyId: "7bcfb6bc-0d9a-4f77-8d98-d2784aa48a60" }, // 'poder sin limites'
    { title: "The Truman Show", bunnyId: "adf0c8bb-9474-4e90-a2d2-590d13e685cd" },
    { title: "Pacific Rim", bunnyId: "96946041-2a72-4f16-88fa-ba59026a8da5" }, // 'Titanes del Pacifico'
    { title: "Gran Turismo", bunnyId: "be95b54f-1372-4969-9a6c-307c8f858293" },
    { title: "Split", bunnyId: "ce07ee66-a348-4f43-a53b-ac570a8905fa" } // 'Fragmentado'
];

async function mapVideos() {
    console.log("🚀 Starting Batch Video Mapping...");

    for (const vid of videos) {
        try {
            // 1. Find TMDB ID
            console.log(`\n🔍 Searching TMDB for: ${vid.title}...`);
            const searchRes = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
                params: {
                    api_key: TMDB_API_KEY,
                    query: vid.title,
                    language: 'es-MX',
                    year: vid.year
                }
            });

            const movie = searchRes.data.results[0];
            if (!movie) {
                console.error(`❌ Movie not found: ${vid.title}`);
                continue;
            }

            console.log(`✅ Found: ${movie.title} (ID: ${movie.id})`);

            // 2. Map in Backend
            console.log(`🔗 Mapping to Bunny ID: ${vid.bunnyId}...`);
            await axios.post(`${API_URL}/videos/map`, {
                tmdbId: movie.id,
                bunnyVideoId: vid.bunnyId,
                title: movie.title,
                type: 'movie'
            }, {
                headers: { 'x-admin-secret': ADMIN_SECRET }
            });

            console.log(`✨ Successfully mapped: ${movie.title}`);

        } catch (e) {
            console.error(`❌ Error processing ${vid.title}:`, e.message);
            if (e.response) console.error(e.response.data);
        }
    }
    console.log("\n🏁 Batch Mapping Completed!");
}

mapVideos();
