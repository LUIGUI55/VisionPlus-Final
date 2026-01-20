
import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Request() req, @Body() createCommentDto: any) {
        return this.commentsService.create(req.user.userId, createCommentDto);
    }

    @Get(':movieId')
    async findAll(@Param('movieId') movieId: string) {
        return this.commentsService.findByMovie(movieId);
    }
}
