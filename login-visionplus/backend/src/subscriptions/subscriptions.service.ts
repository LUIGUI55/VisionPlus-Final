import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Subscription } from './schemas/subscription.schema';
import { Payment } from './schemas/payment.schema';

@Injectable()
export class SubscriptionsService {
    constructor(
        @InjectModel(Subscription.name)
        private subscriptionModel: Model<Subscription>,
        @InjectModel(Payment.name)
        private paymentModel: Model<Payment>,
    ) { }

    async createSubscription(userId: string, planType: string) {
        // 1. Mock Payment Processing
        let amount = 9.99;
        if (planType === 'STANDARD') amount = 14.99;
        if (planType === 'PREMIUM') amount = 19.99;

        const payment = new this.paymentModel({
            userId: new Types.ObjectId(userId),
            amount,
            currency: 'USD',
            status: 'SUCCESS',
            date: new Date(),
        });
        await payment.save();

        // 2. Create Subscription
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

        const subscription = new this.subscriptionModel({
            userId: new Types.ObjectId(userId),
            planType,
            status: 'ACTIVE',
            startDate,
            endDate,
        });
        return subscription.save();
    }

    async getSubscriptionStatus(userId: string) {
        return this.subscriptionModel.findOne({
            userId: new Types.ObjectId(userId),
            status: 'ACTIVE',
        }).sort({ endDate: -1 });
    }
}
