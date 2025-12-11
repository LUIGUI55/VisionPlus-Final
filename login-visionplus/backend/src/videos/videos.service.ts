import { Injectable } from '@nestjs/common';

@Injectable()
export class VideosService {
    // Videos de demostración gratuitos de Google
    private demoVideos = {
        550: { // Fight Club
            url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            title: 'Big Buck Bunny',
            duration: '9:56'
        },
        680: { // Pulp Fiction
            url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            title: 'Elephants Dream',
            duration: '10:53'
        },
        278: { // Shawshank Redemption
            url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            title: 'For Bigger Blazes',
            duration: '0:15'
        },
        default: {
            url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            title: 'Sintel',
            duration: '14:48'
        }
    };

    getVideoUrl(movieId: number) {
        const video = this.demoVideos[movieId] || this.demoVideos.default;
        console.log(`🎥 Streaming video: ${video.title} para película ${movieId}`);
        return video;
    }

    getAllDemoVideos() {
        return this.demoVideos;
    }
}
