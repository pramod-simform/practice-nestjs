import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Schema } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IAuthPayload } from 'src/types/common.types';
import { UserDeviceService } from './device.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private jwtService: JwtService,
    configService: ConfigService,
    private readonly userDeviceService: UserDeviceService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true
    });
  }

  async validate(request: Request, payload: any, done: any) {
    const headers = request.headers;
    const userDevice = await this.userDeviceService.findOne({
      userId: new Schema.Types.ObjectId(payload.userId),
      deviceId: headers["device-id"],
      isSignedOut: true,
    });
    if (userDevice) {
      done("You are already logged-out, please sign-in again.");
    }

    return {
      userId: payload.userId,
      role: payload.role,
      email: payload.email,
      name: payload.name,
    };
  }

  generateToken(payload: IAuthPayload): string {
    return this.jwtService.sign(payload);
  }
}
