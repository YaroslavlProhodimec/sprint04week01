// src/blogs/blogs.service.ts
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { BlogsRepository } from './blogs.repository';
import { CreateBlogDto, SortDataType, UpdateBlogDto } from '../types/blog/input';
import { PostsRepository } from '../posts/posts.repository';

@Injectable()
export class BlogsService {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    @Inject(forwardRef(() => PostsRepository))
    private readonly postsRepository: PostsRepository
  ) {}

  async getAllBlogs(sortData: SortDataType) {
    return this.blogsRepository.getBlogs(sortData);
  }

  async getBlogById(id: string) {
    return this.blogsRepository.getBlogById(id);
  }

  async createBlog(createBlogDto: CreateBlogDto) {
    return this.blogsRepository.createBlog(createBlogDto);
  }

  async updateBlog(id: string, updateBlogDto: UpdateBlogDto) {
    return this.blogsRepository.updateBlog(id, updateBlogDto);
  }

  async deleteBlog(id: string) {
    return this.blogsRepository.deleteBlog(id);
  }

  async getPostsByBlogId(blogId: string, sortData: any, userId?: string) {
    return this.blogsRepository.getPostsByBlogId(blogId, sortData, userId);
  }

  async createPostForBlog(blogId: string, postData: any) {
    return this.postsRepository.createPostForBlog(blogId, postData);
  }
}