// src/blogs/blogs.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsRepository } from './blogs.repository';
import { Blog, BlogSchema } from '../schemas/blog.schema';
import { BlogsController } from './blog.controller';
import { BlogsService } from './blog.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema }
    ])
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepository],
  exports: [BlogsService, BlogsRepository],
})
export class BlogsModule {}