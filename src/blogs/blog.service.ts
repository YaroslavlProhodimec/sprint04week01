// src/blogs/blogs.service.ts
import { Injectable } from '@nestjs/common';
import { BlogsRepository } from './blogs.repository';
import { CreateBlogDto, SortDataType, UpdateBlogDto } from '../types/blog/input';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}

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

  async getBlogPosts(blogId: string, query: any) {
    return this.blogsRepository.getBlogPosts(blogId, query);
  }

  async createPostForBlog(blogId: string, postData: any) {
    return this.blogsRepository.createPostForBlog(blogId, postData);
  }
}