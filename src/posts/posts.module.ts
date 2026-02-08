// src/posts/posts.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsRepository } from './posts.repository';
import { Post, PostSchema } from '../schemas/post.schema';
import { PostLike, PostLikeSchema } from '../schemas/postLike.schema';
import { PostLikesRepository } from '../post-likes/post-likes.repository';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { BlogsModule } from '../blogs/blogs.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: PostLike.name, schema: PostLikeSchema },
    ]),
    forwardRef(() => BlogsModule),
    UsersModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, PostLikesRepository],
  exports: [PostsService, PostsRepository, PostLikesRepository],
})
export class PostsModule {}
