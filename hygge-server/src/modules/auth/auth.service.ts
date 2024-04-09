// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { generateRandomHexColor } from 'src/utils/colors';
import {
  UserCreateDto,
  UserCreatePayload,
  UserResponseDto,
} from '../users/users.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.findByEmail(email);

    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }

    throw new UnauthorizedException('Incorrect credentials');
  }

  signJwt(user: UserResponseDto): Promise<string> {
    const payload = { email: user.email, id: user.id };
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_KEY,
    });
  }

  async getCurrentUser(token: string) {
    if (!token) {
      throw new UnauthorizedException(
        'Cannot get current user without access token',
      );
    }
    const { id } = this.jwtService.decode(token);

    if (!id) {
      throw new UnauthorizedException(
        'Access token does not provide user identification data',
      );
    }

    const user = await this.usersService.findById(id);
    return user;
  }

  getHashedPassword(
    password: string,
    saltOrRounds: string | number = 5,
  ): string {
    return bcrypt.hashSync(password, saltOrRounds);
  }

  formatUserBeforeCreation(user: UserCreatePayload): UserCreateDto {
    const password = this.getHashedPassword(user.password);
    const randomHexaColor = generateRandomHexColor(
      `${user.firstname} ${user.lastname}`,
    );
    const avatar = `https://ui-avatars.com/api/?rounded=true&background=${randomHexaColor}&color=fff&name=${user.firstname[0]}+${user.lastname[0]}`;
    // Test: https://ui-avatars.com/api/?rounded=true&background=00BFFF&color=fff&name=S+P

    return {
      ...user,
      password,
      avatar,
    };
  }
}
