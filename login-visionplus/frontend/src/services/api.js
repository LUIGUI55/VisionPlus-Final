import axios from 'axios';

// Sanitize URL: remove trailing slash and /api if present to avoid double path issues
const RAW_URL = import.meta.env.VITE_API_URL || 'https://visionplus-final-production-bb72.up.railway.app';
const API_URL = RAW_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');

console.log("VisionPlus API Configured URL:", API_URL);

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },
    register: async (email, password) => {
        const response = await api.post('/auth/register', { email, password });
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
};

export const moviesService = {
    getPopularMovies: async () => {
        try {
            const response = await api.get('/movies/popular');
            if (Array.isArray(response.data)) return response.data;
            if (response.data && Array.isArray(response.data.results)) return response.data.results;
            return [];
        } catch {
            try {
                const res = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=213094b8e75a9d685ffb81fb0a71babc&language=es-MX&page=1`);
                return res.data.results || [];
            } catch (err) {
                console.error("Failed to fetch popular movies fallback", err);
                return [];
            }
        }
    },
    searchMovies: async (query) => {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=213094b8e75a9d685ffb81fb0a71babc&language=es-MX&query=${encodeURIComponent(query)}&page=1&include_adult=false`);
            return response.data.results || [];
        } catch (err) {
            console.error("Search failed", err);
            return [];
        }
    },
    getMappedMovies: async () => { return []; },
    getStreamUrl: async (id) => {
        // EMERGENCY OVERRIDE: Fragmentado (381288)
        // Eliminates DB/Backend dependency for this specific blocked video
        if (String(id) === '381288') {
            return {
                title: "Fragmentado",
                url: "https://vz-579059.b-cdn.net/ce07ee66-a348-4f43-a53b-ac570a8905fa/playlist.m3u8"
            };
        }

        try {
            const response = await api.get(`/videos/${id}/stream`);
            return response.data;
        } catch (error) {
            console.warn("Stream fetch failed, returning demo stream", error);
            // Fallback to a working HLS stream for testing
            return {
                url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
                title: "Modo Demo (Backend Off)"
            };
        }
    },
    getVideoDetails: async (id) => {
        try {
            const response = await api.get(`/movies/${id}`);
            return response.data;
        } catch (error) {
            console.warn("Backend detail fetch failed, trying TMDB fallback", error);
            const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=213094b8e75a9d685ffb81fb0a71babc&language=es-MX&append_to_response=credits,videos`);
            return res.data;
        }
    }
};

export const listsService = {
    getFavorites: async (profileId) => {
        const response = await api.get(`/lists/favorites?profileId=${profileId}`);
        return response.data;
    },
    addToFavorites: async (profileId, movieId, movieData) => {
        const response = await api.post('/lists/favorites', { profileId, movieId, movieData });
        return response.data;
    },
    removeFromFavorites: async (profileId, movieId) => {
        const response = await api.delete(`/lists/favorites/${movieId}?profileId=${profileId}`);
        return response.data;
    },
    checkFavorite: async (profileId, movieId) => {
        const response = await api.get(`/lists/favorites/check/${movieId}?profileId=${profileId}`);
        return response.data;
    }
};

export default api;
