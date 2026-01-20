import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Video, VideoDocument } from './schemas/video.schema';
import { MoviesService } from '../movies/movies.service';

@Injectable()
export class VideosService {
    private defaultLibraryId: string;

    constructor(
        @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
        private moviesService: MoviesService,
        private configService: ConfigService
    ) {
        this.defaultLibraryId = this.configService.get<string>('BUNNY_LIBRARY_ID') || '579059';
    }

    // Videos de demostración gratuitos como fallback
    private demoVideos = {
        550: { // Fight Club
            url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            title: 'Big Buck Bunny (Demo)',
            type: 'mp4'
        },
        680: { // Pulp Fiction
            url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            title: 'Elephants Dream (Demo)',
            type: 'mp4'
        },
        278: { // Shawshank Redemption
            url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            title: 'Sintel (Demo)',
            type: 'mp4'
        },
        999: { // HLS Test
            url: 'http://localhost:3000/uploads/hls/playlist.m3u8',
            title: 'HLS Stream (Local)',
            type: 'hls'
        },
        default: {
            url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            title: 'Sintel (Default)',
            type: 'mp4'
        }
    };

    /**
     * Obtiene la URL o configuración del video.
     * Soporta Películas y Episodios de Series.
     */
    async getVideoUrl(tmdbId: number, season?: number, episode?: number) {
        // Build query
        const query: any = { tmdbId };

        // Si vienen season y episode, buscamos específicamente ese
        if (season !== undefined && episode !== undefined) {
            query.season = season;
            query.episode = episode;
        } else {
            // Si no vienen, podría ser una película.
            // Ojo: Si es una serie sin season/episode, ¿qué devolvemos?
            // Asumimos que el player pide algo concreto.
        }

        // 1. Buscar en BD
        // findOne buscará el primero que coincida.
        // Si es serie, debería coincidir con season/episode.
        const video = await this.videoModel.findOne(query).exec();

        if (video) {
            console.log(`🎥 Found real video for ${tmdbId} (S:${video.season} E:${video.episode}): ${video.title}`);
            return {
                type: 'bunny',
                videoId: video.bunnyVideoId,
                libraryId: video.libraryId,
                title: video.title
            };
        }

        // 2. Buscar en Demos (Solo funcionan por ID simple)
        const demo = this.demoVideos[tmdbId];
        if (demo && (!season)) { // Solo demos para pelis por ahora
            console.log(`🎥 Using demo video for ${tmdbId}`);
            return demo;
        }

        // 3. Fallback
        return this.demoVideos.default;
    }

    async createVideoMapping(
        tmdbId: number,
        bunnyVideoId: string,
        title: string,
        libraryId?: string,
        type: string = 'movie',
        season?: number,
        episode?: number
    ) {
        const targetLibraryId = libraryId || this.defaultLibraryId;

        // Construir query para buscar existente
        const query: any = { tmdbId };
        if (type === 'tv') {
            query.season = season;
            query.episode = episode;
            query.type = 'tv';
        } else {
            query.type = 'movie';
        }

        const existing = await this.videoModel.findOne(query);

        if (existing) {
            existing.bunnyVideoId = bunnyVideoId;
            existing.title = title;
            existing.libraryId = targetLibraryId;
            // No cambiamos tipo ni season/episode al actualizar (son la clave)
            return existing.save();
        }

        const newVideo = new this.videoModel({
            tmdbId,
            bunnyVideoId,
            title,
            libraryId: targetLibraryId,
            type,
            season,
            episode
        });
        return newVideo.save();
    }

    getAllDemoVideos() {
        return this.demoVideos;
    }

    async getAllMappedVideos() {
        return this.videoModel.find().exec();
    }

    async getVideoDetails(tmdbId: number) {
        const video = await this.videoModel.findOne({ tmdbId }).exec();
        // Si no está en BD, intentamos buscar en TMDB directamente? 
        // No, el endpoint es para detalle de pelicula mapeada.
        // Pero si el usuario navega a /detail/:id, tal vez quiere ver info aunque no esté mapeada?
        // Asumamos que si llegó aquí es porque existe, o quiere ver info.

        // Estrategia: Obtener info de TMDB siempre. Si falla, usar datos básicos de DB si existe.

        let tmdbData: any = {};
        try {
            tmdbData = await this.moviesService.getMovieDetails(tmdbId);
        } catch (e) {
            console.warn(`Failed to fetch TMDB details for ${tmdbId}, constructing fallback`);
            tmdbData = {
                title: video ? video.title : `Video ${tmdbId}`,
                overview: "Sinopsis no disponible (Error de conexión con TMDB o API Key inválida).",
                poster_path: null,
                backdrop_path: null,
                genres: [],
                vote_average: 0,
                release_date: 'Unknown'
            };
        }

        if (video) {
            // Merge DB data onto TMDB data (e.g. override title if needed, or just ensure ID)
            return { ...tmdbData, ...video.toObject(), id: tmdbId };
        }

        return tmdbData;
    }
}
