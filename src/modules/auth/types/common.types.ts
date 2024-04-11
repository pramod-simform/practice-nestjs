export interface IUserDevice {
  userId: string;
  deviceId: string;
  platform: string;
  isSignedOut?: boolean;
  lastSignedOutAt?: Date;
  lastSignedInAt?: Date;
}

export interface ILogout {
  userId: string;
  deviceId: string;
}
