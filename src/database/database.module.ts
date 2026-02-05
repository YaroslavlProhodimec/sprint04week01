// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseInitService } from './database-init.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mongoUrl = configService.get<string>('MONGO_URL') || 'mongodb://localhost:27017';
        
        // Для mongodb+srv URL база данных может быть указана в URL или отдельно
        // Если база не указана в URL, используем dbName
        const config: any = {
          uri: mongoUrl,
        };
        
        // Добавляем dbName только если его нет в URL
        if (!mongoUrl.includes('/node-blogs') && !mongoUrl.includes('?') && !mongoUrl.includes('&')) {
          config.dbName = 'node-blogs';
        } else if (!mongoUrl.match(/\/[^/?]+(\?|$)/)) {
          // Если в URL нет базы данных, добавляем её
          const separator = mongoUrl.includes('?') ? '&' : '?';
          config.uri = `${mongoUrl}${separator}dbName=node-blogs`;
        }
        
        console.log(`🔌 Подключение к MongoDB Atlas...`);
        
        return config;
      },
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseInitService],
  exports: [MongooseModule],
})
export class DatabaseModule {}