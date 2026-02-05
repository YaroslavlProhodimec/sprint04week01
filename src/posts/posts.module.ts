// src/posts/posts.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsRepository } from './posts.repository';
import { Post, PostSchema } from '../schemas/post.schema';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { BlogsModule } from '../blogs/blogs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema }
    ]),
    forwardRef(() => BlogsModule), // Используем forwardRef для избежания циклической зависимости
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
  exports: [PostsService, PostsRepository],
})
export class PostsModule {}
