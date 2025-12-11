import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Favorite } from './schemas/favorite.schema';
import { Watchlist } from './schemas/watchlist.schema';

@Injectable()
export class ListsService {
    constructor(
        @InjectModel(Favorite.name)
        private favoriteModel: Model<Favorite>,
        @InjectModel(Watchlist.name)
        private watchlistModel: Model<Watchlist>,
    ) { }

    // ======= FAVORITOS =======
    async addToFavorites(profileId: string, movieId: number, movieData: any) {
        // Verificar si ya existe
        const existing = await this.favoriteModel.findOne({
            profileId: new Types.ObjectId(profileId),
            movieId
        });

        if (existing) {
            return existing; // Ya está en favoritos
        }

        const favorite = new this.favoriteModel({
            profileId: new Types.ObjectId(profileId),
            movieId,
            movieData
        });

        console.log(`Agregado a favoritos: ${movieData.title}`);
        return await favorite.save();
    }

    async removeFromFavorites(profileId: string, movieId: number) {
        const favorite = await this.favoriteModel.findOne({
            profileId: new Types.ObjectId(profileId),
            movieId
        });

        if (!favorite) {
            throw new NotFoundException('Película no encontrada en favoritos');
        }

        await this.favoriteModel.deleteOne({ _id: favorite._id });
        console.log(`Removido de favoritos: película ${movieId}`);
        return { message: 'Removido de favoritos' };
    }

    async getFavorites(profileId: string) {
        const favorites = await this.favoriteModel.find({
            profileId: new Types.ObjectId(profileId)
        }).sort({ addedAt: -1 });

        console.log(`${favorites.length} favoritos para perfil ${profileId}`);
        return favorites;
    }

    async isMovieFavorite(profileId: string, movieId: number) {
        const favorite = await this.favoriteModel.findOne({
            profileId: new Types.ObjectId(profileId),
            movieId
        });
        return !!favorite;
    }

    // ======= WATCHLIST =======
    async addToWatchlist(profileId: string, movieId: number, movieData: any) {
        const existing = await this.watchlistModel.findOne({
            profileId: new Types.ObjectId(profileId),
            movieId
        });

        if (existing) {
            return existing;
        }

        const watchlistItem = new this.watchlistModel({
            profileId: new Types.ObjectId(profileId),
            movieId,
            movieData
        });

        console.log(`Agregado a watchlist: ${movieData.title}`);
        return await watchlistItem.save();
    }

    async removeFromWatchlist(profileId: string, movieId: number) {
        const item = await this.watchlistModel.findOne({
            profileId: new Types.ObjectId(profileId),
            movieId
        });

        if (!item) {
            throw new NotFoundException('Película no encontrada en watchlist');
        }

        await this.watchlistModel.deleteOne({ _id: item._id });
        console.log(`Removido de watchlist: película ${movieId}`);
        return { message: 'Removido de watchlist' };
    }

    async getWatchlist(profileId: string) {
        const watchlist = await this.watchlistModel.find({
            profileId: new Types.ObjectId(profileId)
        }).sort({ addedAt: -1 });

        console.log(`${watchlist.length} películas en watchlist para perfil ${profileId}`);
        return watchlist;
    }

    async isMovieInWatchlist(profileId: string, movieId: number) {
        const item = await this.watchlistModel.findOne({
            profileId: new Types.ObjectId(profileId),
            movieId
        });
        return !!item;
    }
}
