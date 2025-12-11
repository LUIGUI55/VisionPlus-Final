import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
    controllers: [MoviesController],
    providers: [MoviesService],
    exports: [MoviesService], // export por si otros módulos necesitan usar el servicio
})
export class MoviesModule { }
