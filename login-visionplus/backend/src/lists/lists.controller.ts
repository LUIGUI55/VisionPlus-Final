import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, Query, BadRequestException } from '@nestjs/common';
import { ListsService } from './lists.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateListItemDto } from './dto/create-list-item.dto';

@Controller('lists')
@UseGuards(JwtAuthGuard)
export class ListsController {
    constructor(private readonly listsService: ListsService) { }

    // ======= FAVORITOS =======
    @Get('favorites')
    getFavorites(@Query('profileId') profileId: string) {
        if (!profileId) {
            throw new BadRequestException('profileId is required');
        }
        return this.listsService.getFavorites(profileId);
    }

    @Post('favorites')
    addToFavorites(@Body() createListItemDto: CreateListItemDto) {
        return this.listsService.addToFavorites(createListItemDto.profileId, createListItemDto.movieId, createListItemDto.movieData);
    }

    @Delete('favorites/:movieId')
    removeFromFavorites(@Query('profileId') profileId: string, @Param('movieId') movieId: string) {
        if (!profileId) {
            throw new BadRequestException('profileId is required');
        }
        return this.listsService.removeFromFavorites(profileId, parseInt(movieId));
    }

    @Get('favorites/check/:movieId')
    checkFavorite(@Query('profileId') profileId: string, @Param('movieId') movieId: string) {
        if (!profileId) {
            throw new BadRequestException('profileId is required');
        }
        return this.listsService.isMovieFavorite(profileId, parseInt(movieId));
    }

    // ======= WATCHLIST =======
    @Get('watchlist')
    getWatchlist(@Query('profileId') profileId: string) {
        if (!profileId) {
            throw new BadRequestException('profileId is required');
        }
        return this.listsService.getWatchlist(profileId);
    }

    @Post('watchlist')
    addToWatchlist(@Body() createListItemDto: CreateListItemDto) {
        return this.listsService.addToWatchlist(createListItemDto.profileId, createListItemDto.movieId, createListItemDto.movieData);
    }

    @Delete('watchlist/:movieId')
    removeFromWatchlist(@Query('profileId') profileId: string, @Param('movieId') movieId: string) {
        if (!profileId) {
            throw new BadRequestException('profileId is required');
        }
        return this.listsService.removeFromWatchlist(profileId, parseInt(movieId));
    }

    @Get('watchlist/check/:movieId')
    checkWatchlist(@Query('profileId') profileId: string, @Param('movieId') movieId: string) {
        if (!profileId) {
            throw new BadRequestException('profileId is required');
        }
        return this.listsService.isMovieInWatchlist(profileId, parseInt(movieId));
    }
}
