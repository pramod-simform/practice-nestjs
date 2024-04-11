// user.model.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRoles } from 'src/types/common.enums';

export type UserDocument = User & Document;

@Schema({ timestamps: true, id: true })
export class User {
  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ enum: [UserRoles], default: UserRoles.MEMBER })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
