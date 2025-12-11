import { IsNotEmpty, IsNumber, IsObject, IsString, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateListItemDto {
    @IsNotEmpty()
    @IsMongoId()
    profileId: string;

    @IsNotEmpty()
    @IsNumber()
    movieId: number;

    @IsNotEmpty()
    @IsObject()
    movieData: {
        title: string;
        posterPath: string;
        voteAverage: number;
        releaseDate: string;
    };
}
