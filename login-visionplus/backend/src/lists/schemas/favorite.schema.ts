import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type FavoriteDocument = HydratedDocument<Favorite>;

@Schema({ timestamps: { createdAt: 'addedAt', updatedAt: false } })
export class Favorite {
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

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
