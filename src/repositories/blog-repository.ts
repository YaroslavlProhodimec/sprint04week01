// src/repositories/blog-repository.ts
// Статический репозиторий для обратной совместимости с валидаторами
import { BlogsRepository } from '../blogs/blogs.repository';

let blogsRepositoryInstance: BlogsRepository | null = null;

export function setBlogsRepository(instance: BlogsRepository) {
  blogsRepositoryInstance = instance;
}

export const BlogRepository = {
  getBlogById: async (id: string) => {
    if (!blogsRepositoryInstance) {
      throw new Error('BlogsRepository not initialized. Make sure to call setBlogsRepository first.');
    }
    return blogsRepositoryInstance.getBlogById(id);
  }
};
