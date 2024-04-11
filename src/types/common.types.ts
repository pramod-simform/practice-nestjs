export interface IDynamicObject {
  [key: string]: any;
}

export interface IAuthPayload {
  userId: string;
  name: string;
  role: string;
  email: string;
}

export interface IClassConstructor {
  new (...args: any[]): {};
}
