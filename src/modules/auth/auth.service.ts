import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from 'src/entities/users.entity';
import { IDynamicObject } from 'src/types/common.types';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { JwtStrategy } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwt: JwtStrategy,
  ) {}

  async findOne(where: IDynamicObject): Promise<User> {
    return this.userModel.findOne(where);
  }

  async register(registerBody: RegisterAuthDto) {
    const passwordSalt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(registerBody.password, passwordSalt);
    
    return await this.userModel.create({
      ...registerBody,
      password: passwordHash,
    });
    true;
  }

  async login(loginBody: LoginAuthDto) {
    const userObj = await this.userModel.findOne({
      email: loginBody.email,
    });
    if (!userObj) {
      throw new UnauthorizedException('Credentials incorrect!');
    }

    const isPasswordMatched = await bcrypt.compare(
      loginBody.password,
      userObj.password,
    );
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Credentials incorrect!');
    }

    const payload = {
      userId: userObj._id.toString(),
      name: userObj.name,
      email: userObj.email,
      role: userObj.role,
    };

    return {
      access_token: this.jwt.generateToken(payload),
      user: userObj,
    };
  }
}
