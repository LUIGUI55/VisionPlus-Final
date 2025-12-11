import { Controller, Get, Param, Query, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('movies')
@UseGuards(JwtAuthGuard) // Requiere autenticación para todos los endpoints
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) { }

    // GET /movies/popular?page=1
    @Get('popular')
    async getPopular(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number) {
        return this.moviesService.getPopularMovies(page);
    }

    // GET /movies/trending?timeWindow=day
    @Get('trending')
    async getTrending(@Query('timeWindow') timeWindow: 'day' | 'week' = 'day') {
        return this.moviesService.getTrendingMovies(timeWindow);
    }

    // GET /movies/top-rated?page=1
    @Get('top-rated')
    async getTopRated(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number) {
        return this.moviesService.getTopRatedMovies(page);
    }

    // GET /movies/upcoming?page=1
    @Get('upcoming')
    async getUpcoming(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number) {
        return this.moviesService.getUpcomingMovies(page);
    }

    // GET /movies/search?query=inception&page=1
    @Get('search')
    async search(
        @Query('query') query: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    ) {
        return this.moviesService.searchMovies(query, page);
    }

    // --- SERIES ---
    @Get('series/popular')
    async getPopularSeries(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number) {
        return this.moviesService.getPopularSeries(page);
    }

    @Get('series/trending')
    async getTrendingSeries(@Query('timeWindow') timeWindow: 'day' | 'week' = 'day') {
        return this.moviesService.getTrendingSeries(timeWindow);
    }

    @Get('series/top-rated')
    async getTopRatedSeries(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number) {
        return this.moviesService.getTopRatedSeries(page);
    }

    @Get('series/:id')
    async getSeriesDetails(@Param('id', ParseIntPipe) id: number) {
        return this.moviesService.getSeriesDetails(id);
    }

    // --- ANIME ---
    @Get('anime')
    async getAnime(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number) {
        return this.moviesService.getAnime(page);
    }

    // GET /movies/:id
    @Get(':id')
    async getDetails(@Param('id', ParseIntPipe) id: number) {
        return this.moviesService.getMovieDetails(id);
    }
}
