// src/testing/testing.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingController } from './testing.controller';
import { Blog, BlogSchema } from '../schemas/blog.schema';
import { Post, PostSchema } from '../schemas/post.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { PostLike, PostLikeSchema } from '../schemas/postLike.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
      { name: PostLike.name, schema: PostLikeSchema },
    ]),
  ],
  controllers: [TestingController],
})
export class TestingModule {}
