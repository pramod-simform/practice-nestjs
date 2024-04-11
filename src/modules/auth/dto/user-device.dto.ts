import { IsBoolean, IsDate, IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { DeviceTypesEnum } from 'src/types/common.enums';

export class UserDeviceDto {
  @IsString()
  @IsMongoId()
  userId?: string;

  @IsNotEmpty()
  @IsString()
  "device-id": string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(DeviceTypesEnum)
  "device-os": string;

  @IsBoolean()
  isSignedOut?: boolean;

  @IsDate()
  lastSignedOutAt?: Date;

  @IsDate()
  lastSignedInAt?: Date;
}
