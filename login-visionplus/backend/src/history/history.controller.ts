import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { HistoryService } from './history.service';
import { SaveHistoryDto } from './dto/save-history.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('history')
@UseGuards(JwtAuthGuard)
export class HistoryController {
    constructor(private readonly historyService: HistoryService) { }

    @Post()
    saveProgress(@Body() saveHistoryDto: SaveHistoryDto) {
        return this.historyService.saveProgress(saveHistoryDto.profileId, saveHistoryDto);
    }

    @Get()
    getHistory(@Query('profileId') profileId: string) {
        if (!profileId) {
            throw new BadRequestException('profileId is required');
        }
        return this.historyService.getHistory(profileId);
    }

    @Get(':movieId')
    getProgress(@Query('profileId') profileId: string, @Param('movieId') movieId: string) {
        if (!profileId) {
            throw new BadRequestException('profileId is required');
        }
        return this.historyService.getProgress(profileId, +movieId);
    }

    @Delete(':movieId')
    remove(@Query('profileId') profileId: string, @Param('movieId') movieId: string) {
        if (!profileId) {
            throw new BadRequestException('profileId is required');
        }
        return this.historyService.remove(profileId, +movieId);
    }
}
