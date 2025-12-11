import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type WatchHistoryDocument = HydratedDocument<WatchHistory>;

@Schema({ timestamps: { createdAt: true, updatedAt: 'lastWatchedAt' } })
export class WatchHistory {
    @Prop({ type: Types.ObjectId, ref: 'Profile', required: true })
    profileId: Types.ObjectId;

    @Prop({ required: true })
    movieId: number;

    @Prop({ required: true })
    progress: number; // segundos vistos

    @Prop({ required: true })
    duration: number; // duración total en segundos
}

export const WatchHistorySchema = SchemaFactory.createForClass(WatchHistory);
