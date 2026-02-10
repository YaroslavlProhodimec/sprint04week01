// src/blogs/blogs.repository.ts
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../schemas/blog.schema';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateBlogDto,
  UpdateBlogDto,
  SortDataType,
} from '../types/blog/input';
import { BlogType } from '../types/blog/output';
import { PostsRepository } from '../posts/posts.repository';

/**
 * Приводит документ блога к типу BlogType.
 * id без подчёркивания: в схеме Blog объявлено поле id (строка, uuid). Mongoose сохраняет его
 * в коллекцию вместе с _id (который добавляет сама MongoDB). В БД лежат оба поля: _id и id.
 * Сначала берём наш id; если его нет — используем _id.toString() (fallback для документов без поля id).
 */
function toBlogType(blogObj: Record<string, unknown>): BlogType {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    id: (blogObj.id as string) ?? (blogObj._id as any)?.toString?.() ?? '',
    name: blogObj.name as string,
    description: blogObj.description as string,
    websiteUrl: blogObj.websiteUrl as string,
    createdAt:
      blogObj.createdAt instanceof Date
        ? blogObj.createdAt.toISOString()
        : (blogObj.createdAt as string),
    isMembership: Boolean(blogObj.isMembership),
  } as BlogType;
}

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @Inject(forwardRef(() => PostsRepository))
    private postsRepository: PostsRepository,
  ) {}

  // Получить все блоги с пагинацией и поиском
  async getBlogs(sortData: SortDataType = {}) {
    const {
      searchNameTerm,
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10,
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
      items: blogs.map((blog) =>
        toBlogType(
          blog.toObject({ versionKey: false }) as unknown as Record<
            string,
            unknown
          >,
        ),
      ),
    };
  }

  // Получить блог по ID
  async getBlogById(id: string): Promise<BlogType | null> {
    const blog = await this.blogModel
      .findOne({ id }, { _id: 0 }) // Исключаем _id как в вашем коде
      .exec();

    if (!blog) return null;
    const blogObj = blog.toObject({ versionKey: false }) as unknown as Record<
      string,
      unknown
    >;
    return toBlogType(blogObj);
  }

  // Создать новый блог
  async createBlog(createBlogDto: CreateBlogDto): Promise<BlogType> {
    const blogData = {
      id: uuidv4(), // Генерируем UUID как в вашем коде
      ...createBlogDto,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };

    const newBlog = new this.blogModel(blogData);
    await newBlog.save();

    const blogObj = newBlog.toObject({
      versionKey: false,
    }) as unknown as Record<string, unknown>;
    return toBlogType(blogObj);
  }

  // Обновить блог
  async updateBlog(id: string, updateBlogDto: UpdateBlogDto): Promise<boolean> {
    const result = await this.blogModel.updateOne({ id }, updateBlogDto).exec();

    return result.matchedCount === 1;
  }

  // Удалить блог
  async deleteBlog(id: string): Promise<boolean> {
    const result = await this.blogModel.deleteOne({ id }).exec();

    return result.deletedCount === 1;
  }

  // Найти блог для проверки существования (для постов)
  // async findBlogForPost(blogId: string): Promise<BlogType | null> {
  //   return this.getBlogById(blogId);
  // }

  // Получить посты блога по blogId (делегируем в PostsRepository.getBlogPosts: там postMapper с extendedLikesInfo)
  async getPostsByBlogId(blogId: string, sortData: any, userId?: string) {
    return this.postsRepository.getBlogPosts(blogId, sortData, userId);
  }

  // Создать пост для блога (если нужно)
  // async createPostForBlog(blogId: string, postData: any) {
  //   // Здесь будет логика создания поста для блога
  //   // Пока заглушка
  //   const blog = await this.getBlogById(blogId);
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  //   return {
  //     id: uuidv4(),
  //     ...postData,
  //     blogId: blogId,
  //     blogName: blog?.name || '',
  //     createdAt: new Date().toISOString(),
  //   };
  // }
}
