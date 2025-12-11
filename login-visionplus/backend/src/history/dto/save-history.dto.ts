import { IsNumber, IsNotEmpty, IsMongoId } from 'class-validator';

export class SaveHistoryDto {
    @IsNotEmpty()
    @IsMongoId()
    profileId: string;

    @IsNotEmpty()
    @IsNumber()
    movieId: number;

    @IsNotEmpty()
    @IsNumber()
    progress: number;

    @IsNotEmpty()
    @IsNumber()
    duration: number;
}
