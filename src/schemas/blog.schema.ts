// src/schemas/blog.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlogDocument = Blog & Document;

@Schema({ timestamps: true })
export class Blog {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true, maxlength: 15 })
  name: string;

  @Prop({ required: true, maxlength: 500 })
  description: string;

  @Prop({ required: true, maxlength: 100 })
  websiteUrl: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: false })
  isMembership: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);