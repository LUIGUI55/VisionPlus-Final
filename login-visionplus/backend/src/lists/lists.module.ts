import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';
import { Favorite, FavoriteSchema } from './schemas/favorite.schema';
import { Watchlist, WatchlistSchema } from './schemas/watchlist.schema';

@Module({
    imports: [MongooseModule.forFeature([
        { name: Favorite.name, schema: FavoriteSchema },
        { name: Watchlist.name, schema: WatchlistSchema },
    ])],
    controllers: [ListsController],
    providers: [ListsService],
    exports: [ListsService],
})
export class ListsModule { }
