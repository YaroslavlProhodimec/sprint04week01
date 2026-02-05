// src/blogs/blogs.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../schemas/blog.schema';
import { v4 as uuidv4 } from 'uuid';
import { CreateBlogDto, UpdateBlogDto, SortDataType } from '../types/blog/input';
import { BlogType } from '../types/blog/output';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>
  ) {}

  // Получить все блоги с пагинацией и поиском
  async getBlogs(sortData: SortDataType = {}) {
    const {
      searchNameTerm,
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10
    } = sortData;

    // Фильтр поиска по имени
    const filter = searchNameTerm
      ? { name: { $regex: searchNameTerm, $options: 'i' } }
      : {};

    // Выполняем запрос с пагинацией
    const blogs = await this.blogModel
      .find(filter, { _id: 0 }) // Исключаем _id как в вашем коде
      .sort({ [sortBy]: sortDirection === 'desc' ? -1 : 1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const totalCount = await this.blogModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: blogs.map(blog => blog.toObject({ versionKey: false }))
    };
  }

  // Получить блог по ID
  async getBlogById(id: string): Promise<BlogType | null> {
    const blog = await this.blogModel
      .findOne({ id }, { _id: 0 }) // Исключаем _id как в вашем коде
      .exec();

    if (!blog) return null;
    
    const blogObj = blog.toObject({ versionKey: false });
    return {
      ...blogObj,
      createdAt: blogObj.createdAt instanceof Date ? blogObj.createdAt.toISOString() : blogObj.createdAt
    } as BlogType;
  }

  // Создать новый блог
  async createBlog(createBlogDto: CreateBlogDto): Promise<BlogType> {
    const blogData = {
      id: uuidv4(), // Генерируем UUID как в вашем коде
      ...createBlogDto,
      createdAt: new Date().toISOString(),
      isMembership: false
    };

    const newBlog = new this.blogModel(blogData);
    await newBlog.save();

    const blogObj = newBlog.toObject({ versionKey: false });
    const result = { ...blogObj };
    if (result._id) {
      delete (result as any)._id;
    }
    return {
      ...result,
      createdAt: result.createdAt instanceof Date ? result.createdAt.toISOString() : result.createdAt
    } as BlogType;
  }

  // Обновить блог
  async updateBlog(id: string, updateBlogDto: UpdateBlogDto): Promise<boolean> {
    const result = await this.blogModel
      .updateOne({ id }, updateBlogDto)
      .exec();

    return result.matchedCount === 1;
  }

  // Удалить блог
  async deleteBlog(id: string): Promise<boolean> {
    const result = await this.blogModel
      .deleteOne({ id })
      .exec();

    return result.deletedCount === 1;
  }

  // Найти блог для проверки существования (для постов)
  async findBlogForPost(blogId: string): Promise<BlogType | null> {
    return this.getBlogById(blogId);
  }

  // Получить посты блога (если нужно)
  async getBlogPosts(blogId: string, query: any) {
    // Здесь будет логика получения постов блога
    // Пока заглушка
    return {
      pagesCount: 0,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      items: []
    };
  }

  // Создать пост для блога (если нужно)
  async createPostForBlog(blogId: string, postData: any) {
    // Здесь будет логика создания поста для блога
    // Пока заглушка
    const blog = await this.getBlogById(blogId);
    return {
      id: uuidv4(),
      ...postData,
      blogId: blogId,
      blogName: blog?.name || '',
      createdAt: new Date().toISOString()
    };
  }
}