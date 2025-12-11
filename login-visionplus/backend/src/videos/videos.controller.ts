import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { VideosService } from './videos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('videos')
@UseGuards(JwtAuthGuard)
export class VideosController {
    constructor(private videosService: VideosService) { }

    @Get(':id/stream')
    getStream(@Param('id') id: string) {
        const videoData = this.videosService.getVideoUrl(parseInt(id));
        return {
            movieId: parseInt(id),
            ...videoData
        };
    }

    @Get('demos')
    getDemos() {
        return this.videosService.getAllDemoVideos();
    }
}
