import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard as AuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsNotEmpty, IsString } from 'class-validator';

class CreateSubscriptionDto {
    @IsNotEmpty()
    @IsString()
    planType: string;
}

@Controller('subscriptions')
export class SubscriptionsController {
    constructor(private readonly subscriptionsService: SubscriptionsService) { }

    @UseGuards(AuthGuard)
    @Post('subscribe')
    async subscribe(@Request() req, @Body() body: CreateSubscriptionDto) {
        return this.subscriptionsService.createSubscription(req.user._id, body.planType);
    }

    @UseGuards(AuthGuard)
    @Get('status')
    async getStatus(@Request() req) {
        return this.subscriptionsService.getSubscriptionStatus(req.user._id);
    }
}
