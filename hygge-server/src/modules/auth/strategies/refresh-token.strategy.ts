import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(private usersService: UsersService) {
    super({
      ignoreExpiration: true,
      passReqToCallback: true,
      secretOrKey: 'My Secret Key Never Let Out Siders',
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const cookie = request?.cookies['auth-cookie'];
          return cookie?.accessToken || null;
        },
      ]),
    });
  }

  async validate(req: Request, payload: any) {
    const data = req?.cookies['auth-cookie'];
    if (!data.refreshToken) {
      throw new UnauthorizedException();
    }
    if (payload == null) {
      throw new UnauthorizedException();
    }
    const user = await this.usersService.findByEmail(payload.email);
    if (user == null) {
      throw new UnauthorizedException();
    }
    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      avatar: user.avatar,
      target_event: user.target_event,
    };
  }
}
