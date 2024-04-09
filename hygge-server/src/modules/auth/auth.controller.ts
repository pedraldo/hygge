import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UserCreatePayload, UserResponseDto } from '../users/users.dto';
import { UsersService } from '../users/users.service';
import {
  AuthLogInBodyDto,
  AuthLogInResponseDto,
  AuthLogOutResponseDto,
  AuthRefreshTokenResponseDto,
} from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  @ApiOperation({
    summary: 'Register a new user',
    operationId: 'create',
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
    type: UserResponseDto,
  })
  async signup(
    @Body() userCreatePayload: UserCreatePayload,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.create(
      this.authService.formatUserBeforeCreation(userCreatePayload),
    );
    const userWithoutPass: UserResponseDto = (({ password, ...object }) =>
      object)(user);

    return userWithoutPass;
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  @UseGuards(AuthGuard('local'))
  @ApiOperation({
    summary: 'Log a user in',
    operationId: 'log in',
  })
  @ApiResponse({
    status: 200,
    description: 'Logged In',
    type: AuthLogInResponseDto,
  })
  async login(
    @Body() body: AuthLogInBodyDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.validateUser(body.email, body.password);
    const token = await this.authService.signJwt(user);
    const secretData = {
      accessToken: token,
      refreshToken: process.env.REFRESH_TOKEN,
    };
    response.cookie('auth-cookie', secretData, {
      expires: new Date(Date.now() + 1 * 3600000), // 1 hour for example
      // httpOnly: process.env.NODE_ENV === 'prod',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'prod',
    });

    return { user, token };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Get('/current')
  @ApiOperation({
    summary: 'Get current logged in user',
    operationId: 'Get current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Logged in user',
    type: UserResponseDto,
  })
  current(@Req() request: Request): Promise<UserResponseDto> {
    const cookie = request.cookies?.['auth-cookie'];
    return this.authService.getCurrentUser(cookie?.accessToken);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Log out current user',
    operationId: 'Log out',
  })
  @ApiResponse({
    status: 200,
    description: 'Log out confirmation',
    type: AuthLogOutResponseDto,
  })
  logout(@Res() response: Response) {
    response.cookie('auth-cookie', '', {
      expires: new Date(Date.now()),
    });
    response.send({ logOutSuccess: true } as AuthLogOutResponseDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('refresh-token'))
  @Get('refresh-token')
  @ApiOperation({
    summary: 'Create a new access token thanks to refresh token',
    operationId: 'Refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'Refresh otken confirmation',
    type: AuthRefreshTokenResponseDto,
  })
  async refreshToken(@Req() req, @Res({ passthrough: true }) res: Response) {
    const jwtToken = await this.authService.signJwt(req.user);
    const secretData = {
      accessToken: jwtToken,
      refreshToken: process.env.REFRESH_TOKEN,
    };

    res.cookie('auth-cookie', secretData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'prod',
      expires: new Date(Date.now() + 1 * 3600000), // 1 hour for example
    });

    return { refreshTokenSuccess: true } as AuthRefreshTokenResponseDto;
  }
}
