import { Prop } from '@nestjs/mongoose';

export type UserDocumentType = User & Document

class AccountData {
  @Prop()
  passwordSalt

  @Prop()
  passwordHash;


  @Prop()
  login;


  @Prop()
  email;

  @Prop({ default: Date })
  createdAt:  Date;

}

export class User {

@Prop({ required: true })

@AccountData
}

