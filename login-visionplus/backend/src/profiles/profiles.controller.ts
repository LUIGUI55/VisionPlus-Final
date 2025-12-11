import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('profiles')
@UseGuards(JwtAuthGuard) // Todos los endpoints requieren autenticación
export class ProfilesController {
    constructor(private readonly profilesService: ProfilesService) { }

    @Post()
    create(@Request() req, @Body() createProfileDto: CreateProfileDto) {
        const userId = req.user.id; // Obtenido del JWT
        return this.profilesService.create(userId, createProfileDto);
    }

    @Get()
    findAll(@Request() req) {
        const userId = req.user.id;
        return this.profilesService.findByUser(userId);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        const userId = req.user.id;
        return this.profilesService.findOne(id, userId);
    }

    @Put(':id')
    update(
        @Request() req,
        @Param('id') id: string,
        @Body() updateProfileDto: UpdateProfileDto
    ) {
        const userId = req.user.id;
        return this.profilesService.update(id, userId, updateProfileDto);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        const userId = req.user.id;
        return this.profilesService.remove(id, userId);
    }
}
