
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;

    @Prop({ required: true })
    movieId: string; // Puede ser ID de TMDB o ID interno, lo guardamos como string para flexibilidad

    @Prop({ required: false })
    content: string;

    @Prop({ required: false })
    emoji: string;

    @Prop({ required: true })
    timestamp: number; // Segundo exacto donde aparece el comentario
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
