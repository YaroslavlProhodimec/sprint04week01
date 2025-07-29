// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { BlogsModule } from './blogs/blogs.module';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Доступ к переменным окружения везде
      envFilePath: '.env'
    }),
    DatabaseModule,   // 🔌 Подключение к MongoDB
    BlogsModule,      // 📝 Блоги
    UsersModule,      // 👥 Пользователи
    PostsModule,      // 📄 Посты
    AuthModule,       // 🔐 Аутентификация
  ],
})
export class AppModule {}