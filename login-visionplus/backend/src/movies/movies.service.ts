import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MoviesService {
  private readonly tmdbApiUrl = 'https://api.themoviedb.org/3';
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY');
    console.log(`MovieService inited. API Key present: ${!!this.apiKey}, value: ${this.apiKey ? this.apiKey.substring(0, 4) + '***' : 'undefined'}`);
  }

  private async tmdbRequest(endpoint: string, params: any = {}) {
    try {
      const response = await axios.get(`${this.tmdbApiUrl}${endpoint}`, {
        params: {
          api_key: this.apiKey,
          language: 'es-MX', // o el idioma que prefieras
          ...params,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error en TMDB request a ${endpoint}:`, error.message);
      throw new HttpException(
        'Error al comunicarse con TMDB service',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getPopularMovies(page: number = 1) {
    console.log(`Obteniendo películas populares - página ${page}`);
    return this.tmdbRequest('/movie/popular', { page });
  }

  // Obtener películas en tendencia (del día)
  async getTrendingMovies(timeWindow: 'day' | 'week' = 'day') {
    console.log(`Obteniendo películas en tendencia (${timeWindow})`);
    return this.tmdbRequest(`/trending/movie/${timeWindow}`);
  }

  // Buscar películas por nombre
  async searchMovies(query: string, page: number = 1) {
    console.log(`Buscando: "${query}"`);

    if (!query || query.trim() === '') {
      throw new HttpException(
        'El término de búsqueda no puede estar vacío',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.tmdbRequest('/search/movie', { query, page });
  }

  // Obtener detalles de una película específica
  async getMovieDetails(movieId: number) {
    console.log(`Obteniendo detalles de película ID: ${movieId}`);
    return this.tmdbRequest(`/movie/${movieId}`, {
      append_to_response: 'credits,videos', // incluir cast y trailers
    });
  }

  // Obtener películas mejor calificadas
  async getTopRatedMovies(page: number = 1) {
    console.log(`Obteniendo películas mejor calificadas - página ${page}`);
    return this.tmdbRequest('/movie/top_rated', { page });
  }

  // Obtener películas próximas a estrenar
  async getUpcomingMovies(page: number = 1) {
    console.log(`Obteniendo próximos estrenos - página ${page}`);
    return this.tmdbRequest('/movie/upcoming', { page });
  }

  // --- SERIES DE TV ---

  // Obtener series populares
  async getPopularSeries(page: number = 1) {
    console.log(`Obteniendo series populares - página ${page}`);
    return this.tmdbRequest('/tv/popular', { page });
  }

  // Obtener series mejor calificadas
  async getTopRatedSeries(page: number = 1) {
    console.log(`Obteniendo series mejor calificadas - página ${page}`);
    return this.tmdbRequest('/tv/top_rated', { page });
  }

  // Obtener series en tendencia
  async getTrendingSeries(timeWindow: 'day' | 'week' = 'day') {
    console.log(`Obteniendo series en tendencia (${timeWindow})`);
    return this.tmdbRequest(`/trending/tv/${timeWindow}`);
  }

  // Obtener detalles de una serie
  async getSeriesDetails(tvId: number) {
    console.log(`Obteniendo detalles de serie ID: ${tvId}`);
    return this.tmdbRequest(`/tv/${tvId}`, {
      append_to_response: 'credits,videos',
    });
  }

  // --- ANIME ---
  // Anime se considera TV Shows de animación (16) producidos en Japón (JP)
  async getAnime(page: number = 1) {
    console.log(`Obteniendo anime - página ${page}`);
    return this.tmdbRequest('/discover/tv', {
      page,
      with_genres: '16', // Animation
      with_origin_country: 'JP', // Japan
      sort_by: 'popularity.desc'
    });
  }
}
