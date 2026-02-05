import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

// Класс для вложенных данных
class AccountData {
  @Prop({ required: true })
  passwordSalt: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, unique: true })
  login: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

// Основная схема пользователя
@Schema()
export class User {
  @Prop({ type: AccountData, _id: false })
  accountData: AccountData;

  @Prop({ default: false })
  isConfirmed: boolean;
}

// Создаем схему Mongoose
export const UserSchema = SchemaFactory.createForClass(User);

// Можно добавить индексы
UserSchema.index({ 'accountData.email': 1 }, { unique: true });