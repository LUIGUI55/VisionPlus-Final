import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema()
export class Subscription {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    planType: string; // 'BASIC', 'PREMIUM'

    @Prop({ required: true })
    status: string; // 'ACTIVE', 'CANCELLED', 'EXPIRED'

    @Prop({ required: true })
    startDate: Date;

    @Prop({ required: true })
    endDate: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
