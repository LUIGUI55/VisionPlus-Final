import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WatchHistory } from './schemas/watch-history.schema';
import { SaveHistoryDto } from './dto/save-history.dto';

@Injectable()
export class HistoryService {
    constructor(
        @InjectModel(WatchHistory.name)
        private historyModel: Model<WatchHistory>,
    ) { }

    async saveProgress(profileId: string, saveHistoryDto: SaveHistoryDto) {
        const { movieId, progress, duration } = saveHistoryDto;

        // Buscar si ya existe registro
        let history = await this.historyModel.findOne({
            profileId: new Types.ObjectId(profileId),
            movieId,
        });

        if (history) {
            // Actualizar
            history.progress = progress;
            history.duration = duration;
        } else {
            // Crear nuevo
            history = new this.historyModel({
                profileId: new Types.ObjectId(profileId),
                movieId,
                progress,
                duration,
            });
        }

        return history.save();
    }

    async getHistory(profileId: string) {
        return this.historyModel.find({
            profileId: new Types.ObjectId(profileId)
        }).sort({ updatedAt: -1 });
    }

    async getProgress(profileId: string, movieId: number) {
        return this.historyModel.findOne({
            profileId: new Types.ObjectId(profileId),
            movieId
        });
    }

    async remove(profileId: string, movieId: number) {
        return this.historyModel.deleteOne({
            profileId: new Types.ObjectId(profileId),
            movieId
        });
    }
}
