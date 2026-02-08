import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostLike, PostLikeDocument } from '../schemas/postLike.schema';

@Injectable()
export class PostLikesRepository {
  constructor(
    @InjectModel(PostLike.name) private postLikeModel: Model<PostLikeDocument>,
  ) {}

  async countByPostAndStatus(
    postId: string,
    likeStatus: 'Like' | 'Dislike',
  ): Promise<number> {
    return this.postLikeModel
      .countDocuments({ postId, likeStatus })
      .exec();
  }

  async findMyStatus(
    postId: string,
    userId: string,
  ): Promise<'Like' | 'Dislike' | null> {
    const like = await this.postLikeModel
      .findOne({ postId, userId: userId.toString() })
      .exec();
    return like?.likeStatus ?? null;
  }

  async findNewestLikes(
    postId: string,
    limit: number = 3,
  ): Promise<Array<{ userId: string; addedAt: Date }>> {
    const likes = await this.postLikeModel
      .find({ postId, likeStatus: 'Like' })
      .sort({ addedAt: -1 })
      .limit(limit)
      .lean()
      .exec();
    return likes.map((l) => ({
      userId: l.userId,
      addedAt: l.addedAt instanceof Date ? l.addedAt : new Date(l.addedAt),
    }));
  }

  async setLike(postId: string, userId: string, likeStatus: 'Like' | 'Dislike'): Promise<void> {
    await this.postLikeModel.updateOne(
      { postId, userId },
      { $set: { postId, userId, likeStatus, addedAt: new Date() } },
      { upsert: true },
    ).exec();
  }
}
