// src/schemas/post.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true, maxlength: 30 })
  title: string;

  @Prop({ required: true, maxlength: 100 })
  shortDescription: string;

  @Prop({ required: true, maxlength: 1000 })
  content: string;

  @Prop({ required: true })
  blogId: string;

  @Prop({ required: true })
  blogName: string;

  @Prop({ default: new Date() })
  createdAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);