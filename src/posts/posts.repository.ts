// src/posts/posts.repository.ts
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../schemas/post.schema';
import { v4 as uuidv4 } from 'uuid';
import { CreatePostDto, UpdatePostDto } from '../types/post/input';
import { OutputPostType } from '../types/post/output';
import { postMapper } from '../types/post/mapper';
import { BlogsRepository } from '../blogs/blogs.repository';
import { PostLikesRepository } from '../post-likes/post-likes.repository';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @Inject(forwardRef(() => BlogsRepository))
    private blogsRepository: BlogsRepository,
    private postLikesRepository: PostLikesRepository,
    private usersRepository: UsersRepository,
  ) {}

  private getMapperDeps() {
    return {
      postLikesRepository: this.postLikesRepository,
      usersRepository: this.usersRepository,
    };
  }

  // Получить все посты с пагинацией (userId опционален — для extendedLikesInfo.myStatus)
  async getPosts(query: any = {}, userId?: string) {
    const {
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10
    } = query;

    const posts = await this.postModel
      .find({}, { _id: 0 })
      .sort({ [sortBy]: sortDirection === 'desc' ? -1 : 1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const totalCount = await this.postModel.countDocuments({});
    const pagesCount = Math.ceil(totalCount / pageSize);
    const deps = this.getMapperDeps();

    const items = await Promise.all(
      posts.map((post) => {
        const postObj = post.toObject({ versionKey: false }) as unknown as Record<string, unknown>;
        return postMapper(postObj, userId, deps);
      }),
    );

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items,
    };
  }

  // Получить пост по ID (userId опционален — для extendedLikesInfo.myStatus)
  async getPostById(id: string, userId?: string): Promise<OutputPostType | null> {
    const post = await this.postModel
      .findOne({ id }, { _id: 0 })
      .exec();

    if (!post) return null;

    const postObj = post.toObject({ versionKey: false }) as unknown as Record<string, unknown>;
    return postMapper(postObj, userId, this.getMapperDeps());
  }

  // Создать новый пост
  async createPost(createPostDto: CreatePostDto): Promise<OutputPostType> {
    // Проверяем существование блога
    const blog = await this.blogsRepository.getBlogById(createPostDto.blogId);
    if (!blog) {
      throw new Error('Blog not found');
    }

    const postData = {
      id: uuidv4(),
      ...createPostDto,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    const newPost = new this.postModel(postData);
    await newPost.save();

    // После сохранения маппим пост через postMapper, чтобы сразу вернуть extendedLikesInfo
    const postObj = newPost.toObject({
      versionKey: false,
    }) as unknown as Record<string, unknown>;
    return postMapper(postObj, undefined, this.getMapperDeps());
  }

  // Обновить пост
  async updatePost(id: string, updatePostDto: UpdatePostDto): Promise<boolean> {
    // Проверяем существование блога, если blogId изменился
    const updateData: any = { ...updatePostDto };
    if (updatePostDto.blogId) {
      const blog = await this.blogsRepository.getBlogById(updatePostDto.blogId);
      if (!blog) {
        throw new Error('Blog not found');
      }
      updateData.blogName = blog.name;
    }

    const result = await this.postModel
      .updateOne({ id }, updateData)
      .exec();

    return result.matchedCount === 1;
  }

  // Удалить пост
  async deletePost(id: string): Promise<boolean> {
    const result = await this.postModel
      .deleteOne({ id })
      .exec();

    return result.deletedCount === 1;
  }

  // Получить посты блога (userId опционален — для extendedLikesInfo.myStatus)
  async getBlogPosts(blogId: string, query: any, userId?: string) {
    const {
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10
    } = query;

    const posts = await this.postModel
      .find({ blogId }, { _id: 0 })
      .sort({ [sortBy]: sortDirection === 'desc' ? -1 : 1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const totalCount = await this.postModel.countDocuments({ blogId });
    const pagesCount = Math.ceil(totalCount / pageSize);
    const deps = this.getMapperDeps();

    const items = await Promise.all(
      posts.map((post) => {
        const postObj = post.toObject({ versionKey: false }) as unknown as Record<string, unknown>;
        return postMapper(postObj, userId, deps);
      }),
    );

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items,
    };
  }

  // Создать пост для блога
  async createPostForBlog(blogId: string, postData: CreatePostDto): Promise<OutputPostType> {
    const blog = await this.blogsRepository.getBlogById(blogId);
    if (!blog) {
      throw new Error('Blog not found');
    }

    return this.createPost({
      ...postData,
      blogId
    });
  }
}
