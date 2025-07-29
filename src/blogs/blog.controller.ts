// src/blogs/blogs.controller.ts
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  CreateBlogDto,
  UpdateBlogDto,
  SortDataType,
} from '../types/blog/input';
import { BlogType } from '../types/blog/output';
import { BlogsService } from './blog.service';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  // GET /blogs - получить все блоги с пагинацией и поиском
  @Get()
  async getBlogs(@Query() query: SortDataType) {
    try {
      const blogs = await this.blogsService.getAllBlogs(query);
      return blogs;
    } catch (error) {
      throw new BadRequestException('Failed to get blogs');
    }
  }

  // GET /blogs/:id - получить блог по ID
  @Get(':id')
  async getBlog(@Param('id') id: string): Promise<BlogType> {
    const blog = await this.blogsService.getBlogById(id);

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }

    return blog;
  }

  // POST /blogs - создать новый блог
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBlog(@Body() createBlogDto: CreateBlogDto): Promise<BlogType> {
    try {
      const newBlog = await this.blogsService.createBlog(createBlogDto);
      return newBlog;
    } catch (error) {
      throw new BadRequestException('Failed to create blog');
    }
  }

  // PUT /blogs/:id - обновить блог
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<void> {
    const updated = await this.blogsService.updateBlog(id, updateBlogDto);

    if (!updated) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
  }

  // DELETE /blogs/:id - удалить блог
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') id: string): Promise<void> {
    const deleted = await this.blogsService.deleteBlog(id);

    if (!deleted) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
  }

  // GET /blogs/:id/posts - получить посты блога
  @Get(':id/posts')
  async getBlogPosts(@Param('id') blogId: string, @Query() query: any) {
    const blog = await this.blogsService.getBlogById(blogId);

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${blogId} not found`);
    }

    const posts = await this.blogsService.getBlogPosts(blogId, query);
    return posts;
  }

  // POST /blogs/:id/posts - создать пост для блога
  @Post(':id/posts')
  @HttpCode(HttpStatus.CREATED)
  async createPostForBlog(@Param('id') blogId: string, @Body() postData: any) {
    const blog = await this.blogsService.getBlogById(blogId);

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${blogId} not found`);
    }

    const newPost = await this.blogsService.createPostForBlog(blogId, postData);
    return newPost;
  }
}
