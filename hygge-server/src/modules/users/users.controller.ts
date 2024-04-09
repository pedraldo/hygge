import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  @Get('')
  @UseGuards(AuthGuard('jwt'))
  findMany() {
    return this.usersService.findMany();
  }

  @Post('target-event/:id')
  @UseGuards(AuthGuard('jwt'))
  targetEvent(@Req() request: Request, @Param('id') eventId: string) {
    const cookie = request.cookies?.['auth-cookie'];
    const { id } = this.jwtService.decode(cookie?.accessToken);
    return this.usersService.connectUserToEvent(id, eventId);
  }
}
