import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostLikeDocument = PostLike & Document;

@Schema({ collection: 'postLikes', timestamps: false })
export class PostLike {
  @Prop({ required: true })
  postId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, enum: ['Like', 'Dislike'] })
  likeStatus: 'Like' | 'Dislike';

  @Prop({ default: () => new Date() })
  addedAt: Date;
}

export const PostLikeSchema = SchemaFactory.createForClass(PostLike);

PostLikeSchema.index({ postId: 1, userId: 1 }, { unique: true });
