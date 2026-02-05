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
        // Проверяем переменные окружения
        const mongoUrl = configService.get<string>('MONGO_URL') || process.env.MONGO_URL;
        
        if (!mongoUrl) {
          console.error('❌ MONGO_URL is not defined!');
          console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('MONGO')));
          throw new Error('MONGO_URL is not defined in environment variables');
        }
        
        console.log(`🔌 Подключение к MongoDB Atlas...`);
        console.log(`📍 MongoDB URL: ${mongoUrl.substring(0, 30)}...`);
        
        return {
          uri: mongoUrl,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseInitService],
  exports: [MongooseModule],
})
export class DatabaseModule {}