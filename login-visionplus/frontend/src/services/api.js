import axios from 'axios';

let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Hotfix: Asegurar que URL tenga protocolo. Si no, Axios asume que es path relativo y lo duplica.
if (!API_URL.startsWith('http')) {
  API_URL = `https://${API_URL}`;
}

console.log("---------------------------------------------");
console.log("🚀 VisionPlus API Configuration");
console.log("📡 API_URL:", API_URL);
console.log("💻 Environment:", import.meta.env.MODE);
console.log("---------------------------------------------");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a cada request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },
  register: async (email, password) => {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
  getCurrentUser: async () => {
    // Assuming there is an endpoint for this, otherwise decode token
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      return null;
    }
  }
};

export const moviesService = {
  getMappedMovies: async () => {
    const response = await api.get('/videos/mapped');
    return response.data;
  },
  getPopularMovies: async () => {
    // Usamos el endpoint público de populares para llenar la home
    // Nota: El backend actúa como proxy a TMDB
    const response = await api.get('/movies/popular');
    // La respuesta de TMDB viene en .results
    return response.data.results || [];
  },
  getVideoDetails: async (id) => {
    const response = await api.get(`/videos/details/${id}`);
    return response.data;
  },
  getStreamUrl: async (id) => {
    const response = await api.get(`/videos/${id}/stream`);
    return response.data;
  },
  searchMovies: async (query) => {
    // Busca películas por título (backend proxy a TMDB)
    const response = await api.get(`/movies/search`, {
      params: { query }
    });
    // La respuesta de TMDB viene en .results
    return response.data.results || [];
  }
};

export default api;
