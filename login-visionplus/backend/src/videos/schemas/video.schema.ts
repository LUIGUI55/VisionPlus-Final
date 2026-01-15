import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VideoDocument = Video & Document;

@Schema()
export class Video {
    @Prop({ required: true, index: true }) // Quitamos unique: true para permitir episodios
    tmdbId: number;

    @Prop({ required: true })
    bunnyVideoId: string;

    @Prop({ required: true })
    libraryId: string;

    @Prop()
    title: string;

    @Prop({ enum: ['movie', 'tv'], default: 'movie' })
    type: string;

    @Prop()
    season?: number;

    @Prop()
    episode?: number;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
