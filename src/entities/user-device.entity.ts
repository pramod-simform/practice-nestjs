import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDeviceDocument = UserDevice & Document;

@Schema({ timestamps: true, collection: "user_devices" })
export class UserDevice {
  @Prop({ required: true, type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ required: true })
  deviceId: string;

  @Prop({ enum: ['android', 'ios', 'web'], required: true })
  platform: string;

  @Prop({ default: false })
  isSignedOut: boolean;

  @Prop({ default: null })
  lastSignedOutAt: Date;

  @Prop({ default: null })
  lastSignedInAt: Date;
}

export const UserDeviceSchema = SchemaFactory.createForClass(UserDevice);
