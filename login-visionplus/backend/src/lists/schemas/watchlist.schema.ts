import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type WatchlistDocument = HydratedDocument<Watchlist>;

@Schema({ timestamps: { createdAt: 'addedAt', updatedAt: false } })
export class Watchlist {
    @Prop({ type: Types.ObjectId, ref: 'Profile', required: true })
    profileId: Types.ObjectId;

    @Prop({ required: true })
    movieId: number; // ID de TMDB

    @Prop({ type: Object })
    movieData: {
        title: string;
        posterPath: string;
        voteAverage: number;
        releaseDate: string;
    };
}

export const WatchlistSchema = SchemaFactory.createForClass(Watchlist);
