import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
            // Intenta endpoint local si existe
            const response = await api.get('/movies/popular');
            // Ensure we always return an array
            if (Array.isArray(response.data)) {
                return response.data;
            } else if (response.data && Array.isArray(response.data.results)) {
                return response.data.results;
            }
            return [];
        } catch {
            // Fallback a TMDB directo
            try {
                const res = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=9b6bf735a29777520e0e0a5822e1775e&language=es-MX&page=1`);
                return res.data.results || [];
            } catch (err) {
                console.error("Failed to fetch popular movies fallback", err);
                return [];
            }
        }
    },
    searchMovies: async (query) => {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=9b6bf735a29777520e0e0a5822e1775e&language=es-MX&query=${encodeURIComponent(query)}&page=1&include_adult=false`);
            return response.data.results || [];
        } catch (err) {
            console.error("Search failed", err);
            return [];
        }
    },
    getMappedMovies: async () => {
        // Stub fallback
        return [];
    },
    getStreamUrl: async (id) => {
        const response = await api.get(`/movies/${id}/stream`);
        return response.data;
    },
    getVideoDetails: async (id) => {
        const response = await api.get(`/movies/${id}`);
        return response.data;
    }
};

export const commentsService = {
    getComments: async (movieId) => {
        return [];
    },
    addComment: async (movieId, text, emoji, timestamp) => {
        return {};
    }
};

export default api;
