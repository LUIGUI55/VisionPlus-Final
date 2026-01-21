import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://visionplus-final-production-bb72.up.railway.app';

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
        const response = await api.get(`/videos/${id}/stream`);
        return response.data;
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
