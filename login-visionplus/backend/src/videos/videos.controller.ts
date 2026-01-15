import { Controller, Get, Param, UseGuards, Post, Body, Headers, HttpException, HttpStatus, Query } from '@nestjs/common';
import { VideosService } from './videos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('videos')
export class VideosController {
    constructor(private videosService: VideosService) { }

    @Get(':id/stream')
    @UseGuards(JwtAuthGuard)
    async getStream(
        @Param('id') id: string,
        @Query('season') season?: string,
        @Query('episode') episode?: string
    ) {
        const s = season ? parseInt(season) : undefined;
        const e = episode ? parseInt(episode) : undefined;

        const videoData = await this.videosService.getVideoUrl(parseInt(id), s, e);
        return {
            movieId: parseInt(id),
            ...videoData
        };
    }

    @Post('map')
    async mapVideo(
        @Body() body: {
            tmdbId: number;
            bunnyVideoId: string;
            title: string;
            libraryId?: string;
            type?: string;
            season?: number;
            episode?: number;
        },
        @Headers('x-admin-secret') secret: string
    ) {
        console.log('👀 Request received at mapVideo endpoint');
        console.log('Secret received:', secret ? '***' : 'undefined');
        const ADMIN_SECRET = process.env.ADMIN_SECRET || 'visionplus_admin';

        if (secret !== ADMIN_SECRET) {
            console.log(`❌ Unauthorized Admin Access Attempt with secret: ${secret}`);
            throw new HttpException('Unauthorized: Invalid Admin Secret', HttpStatus.FORBIDDEN);
        }

        console.log(`✅ Admin Access Granted for ${body.type || 'movie'}: ${body.title}`);
        return this.videosService.createVideoMapping(
            body.tmdbId,
            body.bunnyVideoId,
            body.title,
            body.libraryId,
            body.type,
            body.season,
            body.episode
        );
    }

    @Get('details/:id')
    @UseGuards(JwtAuthGuard)
    async getVideoDetails(@Param('id') id: string) {
        return this.videosService.getVideoDetails(parseInt(id));
    }

    @Get('mapped')
    @UseGuards(JwtAuthGuard)
    async getMappedVideos() {
        return this.videosService.getAllMappedVideos();
    }

    @Get('demos')
    @UseGuards(JwtAuthGuard)
    getDemos() {
        return this.videosService.getAllDemoVideos();
    }
}
