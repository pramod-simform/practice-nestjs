import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserDevice } from 'src/entities/user-device.entity';
import { IDynamicObject } from 'src/types/common.types';
import { ILogout, IUserDevice } from './types/common.types';

@Injectable()
export class UserDeviceService {
  constructor(
    @InjectModel(UserDevice.name) private userDeviceModel: Model<UserDevice>,
  ) {}

  async findOne(where: IDynamicObject) {
    return this.userDeviceModel.findOne(where);
  }

  async updateOne({
    where,
    data,
  }: {
    where: IDynamicObject;
    data: IDynamicObject;
  }) {
    return this.userDeviceModel.updateOne(where, { $set: data });
  }

  async registerDevice(userDeviceInfo: IUserDevice) {
    return this.userDeviceModel.updateOne(
      {
        userId: new Types.ObjectId(userDeviceInfo.userId),
        deviceId: userDeviceInfo.deviceId,
      },
      {
        platform: userDeviceInfo.platform,
        lastSignedInAt: new Date(),
        isSignedOut: false,
      },
      {
        upsert: true,
      },
    );
  }

  async logoutDevice(userDeviceInfo: ILogout) {
    const userDeviceObj = await this.findOne({
      userId: new Types.ObjectId(userDeviceInfo.userId),
      deviceId: userDeviceInfo.deviceId,
    });
    if (userDeviceObj?._id) {
      return await this.updateOne({
        where: {
          userId: userDeviceObj.userId,
          deviceId: userDeviceInfo.deviceId,
        },
        data: {
          isSignedOut: true,
          lastSignedOutAt: new Date(),
        },
      });
    }

    return false;
  }
}
