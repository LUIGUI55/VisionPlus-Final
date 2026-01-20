
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';

@Injectable()
export class CommentsService {
    constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) { }

    async create(userId: string, data: any): Promise<Comment> {
        const newComment = new this.commentModel({
            ...data,
            user: userId,
        });
        return newComment.save();
    }

    async findByMovie(movieId: string): Promise<Comment[]> {
        return this.commentModel.find({ movieId }).populate('user', 'name email').sort({ timestamp: 1 }).exec();
    }
}
