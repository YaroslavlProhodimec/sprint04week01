// src/app.module.ts
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { BlogsModule } from './blogs/blogs.module';
import { UsersModule } from './users/users.module';
import { setBlogsRepository } from './repositories/blog-repository';
import { BlogsRepository } from './blogs/blogs.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Доступ к переменным окружения везде
      envFilePath: process.env.NODE_ENV === 'production' ? undefined : '.env',
      ignoreEnvFile: process.env.NODE_ENV === 'production', // На Vercel используем переменные окружения из панели
    }),
    DatabaseModule,
    BlogsModule,
    UsersModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private blogsRepository: BlogsRepository) {}

  onModuleInit() {
    // Инициализируем BlogRepository для валидаторов
    setBlogsRepository(this.blogsRepository);
  }
}