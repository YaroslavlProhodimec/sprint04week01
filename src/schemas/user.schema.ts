import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocumentType = User & Document;

@Schema()
class AccountData {
  @Prop()
  passwordSalt: string;

  @Prop()
  passwordHash: string;

  @Prop()
  login: string;

  @Prop()
  email: string;

  @Prop({ default: Date })
  createdAt: Date;
}

@Schema()
export class User {
  @Prop({ required: true })
  accountData: AccountData;
}

export const UserSchema = SchemaFactory.createForClass(User);
