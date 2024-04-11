import {
  Body,
  ConflictException,
  Controller,
  Get,
  Headers,
  HttpCode,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { CurrentUser } from 'src/decorators/user.decorator';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { IAuthPayload, IDynamicObject } from 'src/types/common.types';
import { UserDeviceDto } from './dto/user-device.dto';
import { UserDeviceService } from './device.service';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/types/common.enums';
import { JwtRoleGuard } from './guards/user-role.guard';

@Controller('/')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userDeviceService: UserDeviceService,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(201)
  async register(
    @Body() reqBody: RegisterAuthDto,
    @Headers() headers: UserDeviceDto,
  ) {
    const userObj = await this.authService.findOne({
      email: reqBody.email,
    });

    if (userObj) {
      throw new ConflictException('Email already exists!');
    }

    const newUser = await this.authService.register(reqBody);

    if (newUser) {
      this.registerDevice({
        headers,
        userId: newUser._id.toString(),
      });
      return {
        message: 'User registered successfully!',
      };
    }
    throw new InternalServerErrorException('Something went wrong!');
  }

  @Public()
  @HttpCode(200)
  @Post('login')
  async login(
    @Body() reqBody: LoginAuthDto,
    @Headers() headers: UserDeviceDto,
  ) {
    const loginPayload = await this.authService.login(reqBody);
    if (loginPayload.user) {
      this.registerDevice({
        headers,
        userId: loginPayload.user._id.toString(),
      });
    }
    return {
      access_token: loginPayload.access_token,
    };
  }

  @Roles(UserRoles.ADMIN, UserRoles.MANAGER, UserRoles.MEMBER)
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(
    @CurrentUser() user: IAuthPayload,
    @Headers() headers: UserDeviceDto,
  ) {
    const { userId } = user;
    const logoutResult = await this.userDeviceService.logoutDevice({
      userId,
      deviceId: headers['device-id'],
    });

    if (!logoutResult) {
      throw new InternalServerErrorException('Something went wrong!');
    }

    return {
      message: 'User logged-out successfully!',
    };
  }

  @Roles(UserRoles.ADMIN, UserRoles.MANAGER, UserRoles.MEMBER)
  @UseGuards(JwtAuthGuard, JwtRoleGuard)
  @Get('profile')
  @HttpCode(200)
  profile(@CurrentUser() user: IAuthPayload) {
    return user;
  }

  private registerDevice({
    headers,
    userId,
  }: {
    headers: IDynamicObject;
    userId: string;
  }) {
    return this.userDeviceService.registerDevice({
      userId,
      deviceId: headers['device-id'],
      platform: headers['device-os'],
      isSignedOut: false,
      lastSignedInAt: new Date(),
    });
  }
}
