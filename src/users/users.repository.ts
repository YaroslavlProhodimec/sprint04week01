// src/users/users.repository.ts  // ⚠️ Исправил имя файла
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';

interface SortData {
  sortDirection?: 'asc' | 'desc';
  sortBy?: string;
  pageSize?: number;
  pageNumber?: number;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
}

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Получить всех пользователей с пагинацией и поиском
  async getAllUsers(sortData: SortData) {
    const sortDirection = sortData.sortDirection ?? 'desc';
    const sortBy = sortData.sortBy ?? 'accountData.createdAt';
    const pageSize = sortData.pageSize ?? 10;
    const pageNumber = sortData.pageNumber ?? 1;
    const searchLoginTerm = sortData.searchLoginTerm ?? null;
    const searchEmailTerm = sortData.searchEmailTerm ?? null;

    // Строим фильтр поиска
    const searchFilters: any[] = [];
    if (searchLoginTerm) {
      searchFilters.push({
        'accountData.login': {
          $regex: searchLoginTerm,
          $options: 'i'
        }
      });
    }
    if (searchEmailTerm) {
      searchFilters.push({
        'accountData.email': {
          $regex: searchEmailTerm,
          $options: 'i'
        }
      });
    }

    const filter = searchFilters.length > 0 ? { $or: searchFilters } : {};

    const users = await this.userModel
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'desc' ? -1 : 1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const totalCount = await this.userModel.countDocuments(filter);
    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pageCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: users.map(user => ({
        id: (user._id as any).toString(),
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt
      }))
    };
  }

  // Найти пользователя по ID
  // async findById(id: string): Promise<UserDocument | null> {
  //   if (!id.match(/^[0-9a-fA-F]{24}$/)) {  // ⚠️ Добавил проверку ObjectId
  //     return null;
  //   }
  //   return this.userModel.findById(id).exec();
  // }

  // Найти пользователя по логину или email (ТОЧНЫЙ поиск)
  // async findByLoginOrEmail(loginOrEmail: string): Promise<UserDocument | null> {
  //   return this.userModel.findOne({
  //     $or: [
  //       { 'accountData.login': loginOrEmail },  // ⚠️ Убрал regex для точного поиска
  //       { 'accountData.email': loginOrEmail }
  //     ]
  //   }).exec();
  // }

  // // Найти пользователя по коду подтверждения
  // async findByConfirmationCode(confirmationCode: string): Promise<UserDocument | null> {
  //   return this.userModel.findOne({
  //     'emailConfirmation.confirmationCode': confirmationCode
  //   }).exec();
  // }
  //
  // // Создать нового пользователя
  // async createUser(
  //   login: string,
  //   email: string,
  //   password: string,
  //   confirmationCode: string | null = null,
  //   isConfirmed: boolean = false,
  //   expirationDate: Date | null = null  // ⚠️ Исправил тип на Date
  // ): Promise<UserDocument> {
  //   // Проверяем существование пользователя
  //   const existingUserByLogin = await this.userModel.findOne({
  //     'accountData.login': login
  //   }).exec();
  //
  //   if (existingUserByLogin) {
  //     throw new Error('User with this login already exists');
  //   }
  //
  //   const existingUserByEmail = await this.userModel.findOne({
  //     'accountData.email': email
  //   }).exec();
  //
  //   if (existingUserByEmail) {
  //     throw new Error('User with this email already exists');
  //   }
  //
  //   // Генерируем хеш пароля
  //   const passwordSalt = await bcrypt.genSalt(10);
  //   const passwordHash = await this.generateHash(password, passwordSalt);  // ⚠️ Исправил имя метода
  //
  //   const userData = {
  //     accountData: {
  //       login,
  //       email,
  //       passwordHash,
  //       passwordSalt,
  //       createdAt: new Date()
  //     },
  //     emailConfirmation: {
  //       confirmationCode,
  //       isConfirmed,
  //       expirationDate: expirationDate || new Date(Date.now() + 24 * 60 * 60 * 1000)  // ⚠️ Дефолт 24 часа
  //     }
  //   };
  //
  //   const newUser = new this.userModel(userData);
  //   return newUser.save();
  // }
  //
  // // Обновить пользователя
  // async updateUser(id: string, updateData: any): Promise<UserDocument | null> {
  //   return this.userModel
  //     .findByIdAndUpdate(id, { $set: updateData }, { new: true })
  //     .exec();
  // }
  //
  // // Подтвердить email пользователя
  // async confirmEmail(userId: string): Promise<boolean> {  // ⚠️ Лучше по userId
  //   const result = await this.userModel.updateOne(
  //     { _id: userId },
  //     {
  //       $set: {
  //         'emailConfirmation.isConfirmed': true,
  //         'emailConfirmation.confirmationCode': null,
  //         'emailConfirmation.expirationDate': null
  //       }
  //     }
  //   ).exec();
  //
  //   return result.modifiedCount === 1;
  // }
  //
  // // Обновить код подтверждения
  // async updateConfirmationCode(
  //   userId: string,
  //   confirmationCode: string,
  //   expirationDate: Date  // ⚠️ Исправил тип
  // ): Promise<boolean> {
  //   const result = await this.userModel.updateOne(
  //     { _id: userId },
  //     {
  //       $set: {
  //         'emailConfirmation.confirmationCode': confirmationCode,
  //         'emailConfirmation.expirationDate': expirationDate,
  //         'emailConfirmation.isConfirmed': false
  //       }
  //     }
  //   ).exec();
  //
  //   return result.modifiedCount === 1;
  // }
  //
  // // Удалить пользователя
  // async deleteUser(id: string): Promise<boolean> {
  //   const result = await this.userModel.deleteOne({ _id: id }).exec();
  //   return result.deletedCount > 0;
  // }
  //
  // // Проверить учетные данные для входа
  // async checkCredentials(loginOrEmail: string, password: string): Promise<UserDocument | null> {
  //   const user = await this.findByLoginOrEmail(loginOrEmail);
  //
  //   if (!user) {
  //     return null;
  //   }
  //
  //   const passwordHash = await this.generateHash(password, user.accountData.passwordSalt);
  //
  //   if (passwordHash !== user.accountData.passwordHash) {
  //     return null;
  //   }
  //
  //   if (!user.emailConfirmation.isConfirmed) {
  //     throw new Error('Email not confirmed');  // ⚠️ Отдельная ошибка
  //   }
  //
  //   return user;
  // }
  //
  // // Вспомогательный метод для генерации хеша (приватный)
  // private async generateHash(password: string, salt: string): Promise<string> {
  //   return bcrypt.hash(password, salt);
  // }
  //
  // // ⚠️ Добавил недостающие методы:
  //
  // // Найти пользователя по логину (для регистрации)
  // async findByLogin(login: string): Promise<UserDocument | null> {
  //   return this.userModel.findOne({ 'accountData.login': login }).exec();
  // }
  //
  // // Найти пользователя по email (для регистрации)
  // async findByEmail(email: string): Promise<UserDocument | null> {
  //   return this.userModel.findOne({ 'accountData.email': email }).exec();
  // }
  //
  // // Обновить пароль
  // async updatePassword(userId: string, newPassword: string): Promise<boolean> {
  //   const passwordSalt = await bcrypt.genSalt(10);
  //   const passwordHash = await this.generateHash(newPassword, passwordSalt);
  //
  //   const result = await this.userModel.updateOne(
  //     { _id: userId },
  //     {
  //       $set: {
  //         'accountData.passwordHash': passwordHash,
  //         'accountData.passwordSalt': passwordSalt
  //       }
  //     }
  //   ).exec();
  //
  //   return result.modifiedCount === 1;
  // }
}
