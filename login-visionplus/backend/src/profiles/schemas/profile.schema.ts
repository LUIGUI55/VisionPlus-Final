import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ timestamps: true })
export class Profile {
    @Prop({ required: true })
    name: string;

    @Prop({ default: '😊' })
    avatar: string;

    @Prop({ default: false })
    isKids: boolean;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
