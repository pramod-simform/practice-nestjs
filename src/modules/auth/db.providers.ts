import { UserDevice, UserDeviceSchema } from 'src/entities/user-device.entity';
import { User, UserSchema } from 'src/entities/users.entity';

export const DBProviders = [
  { name: User.name, schema: UserSchema },
  { name: UserDevice.name, schema: UserDeviceSchema },
];
