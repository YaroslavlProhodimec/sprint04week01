// src/database/database-init.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { setConnection } from '../db';

@Injectable()
export class DatabaseInitService implements OnModuleInit {
  constructor(
    @InjectConnection() private connection: Connection
  ) {}

  onModuleInit() {
    // Инициализируем db connection для обратной совместимости
    setConnection(this.connection);
  }
}
