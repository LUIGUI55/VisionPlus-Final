import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { WatchHistory, WatchHistorySchema } from './schemas/watch-history.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: WatchHistory.name, schema: WatchHistorySchema }])],
    controllers: [HistoryController],
    providers: [HistoryService],
    exports: [HistoryService],
})
export class HistoryModule { }
