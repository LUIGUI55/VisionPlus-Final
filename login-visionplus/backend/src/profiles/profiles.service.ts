import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from './schemas/profile.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
    constructor(
        @InjectModel(Profile.name)
        private profileModel: Model<Profile>,
    ) { }

    async create(userId: string, createProfileDto: CreateProfileDto) {
        // Verificar que el usuario no tenga más de 5 perfiles
        const count = await this.profileModel.countDocuments({ userId });

        if (count >= 5) {
            throw new BadRequestException('No puedes tener más de 5 perfiles');
        }

        const profile = new this.profileModel({
            ...createProfileDto,
            userId,
        });

        const savedProfile = await profile.save();
        console.log(`Perfil creado: ${savedProfile.name} para usuario ${userId}`);

        return savedProfile;
    }

    async findByUser(userId: string) {
        const profiles = await this.profileModel.find({ userId }).sort({ createdAt: 1 });

        console.log(`${profiles.length} perfiles encontrados para usuario ${userId}`);
        return profiles;
    }

    async findOne(id: string, userId: string) {
        const profile = await this.profileModel.findOne({
            _id: id,
            userId,
        });

        if (!profile) {
            throw new NotFoundException('Perfil no encontrado');
        }

        return profile;
    }

    async update(id: string, userId: string, updateProfileDto: UpdateProfileDto) {
        const profile = await this.findOne(id, userId);

        Object.assign(profile, updateProfileDto);

        const updated = await profile.save();
        console.log(`Perfil actualizado: ${updated.name}`);

        return updated;
    }

    async remove(id: string, userId: string) {
        const profile = await this.findOne(id, userId);

        await this.profileModel.deleteOne({ _id: id });
        console.log(`Perfil eliminado: ${profile.name}`);

        return { message: 'Perfil eliminado correctamente' };
    }
}
