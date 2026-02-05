// src/posts/posts.service.ts
import { Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { CreatePostDto, UpdatePostDto } from '../types/post/input';
import { OutputPostType } from '../types/post/output';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async getAllPosts(query: any) {
    return this.postsRepository.getPosts(query);
  }

  async getPostById(id: string): Promise<OutputPostType | null> {
    return this.postsRepository.getPostById(id);
  }

  async createPost(createPostDto: CreatePostDto): Promise<OutputPostType> {
    return this.postsRepository.createPost(createPostDto);
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto): Promise<boolean> {
    return this.postsRepository.updatePost(id, updatePostDto);
  }

  async deletePost(id: string): Promise<boolean> {
    return this.postsRepository.deletePost(id);
  }

  async getBlogPosts(blogId: string, query: any) {
    return this.postsRepository.getBlogPosts(blogId, query);
  }

  async createPostForBlog(blogId: string, postData: CreatePostDto): Promise<OutputPostType> {
    return this.postsRepository.createPostForBlog(blogId, postData);
  }
}
