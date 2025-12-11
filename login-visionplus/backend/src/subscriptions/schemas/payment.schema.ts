import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema()
export class Payment {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true })
    currency: string;

    @Prop({ required: true })
    status: string; // 'SUCCESS', 'FAILED'

    @Prop({ required: true })
    date: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
