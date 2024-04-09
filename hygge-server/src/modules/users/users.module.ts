import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [],
  providers: [UsersService, JwtService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
