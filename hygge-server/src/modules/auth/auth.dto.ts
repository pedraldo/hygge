import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserResponseDto } from '../users/users.dto';

export class AuthLogInResponseDto {
  @ApiProperty({
    description: 'User logged in',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  @ApiProperty({
    example: 'eYa3rDk8GJB7uy...',
    description: 'User access token',
    type: String,
  })
  token: string;
}

export class AuthLogInBodyDto {
  @ApiProperty({
    example: 'email@email.com',
    description: 'User email',
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'myStrongestPassword123',
    description: 'User password',
    type: String,
  })
  @IsNotEmpty()
  password: string;
}

export class AuthLogOutResponseDto {
  @ApiProperty({
    example: true,
    description: 'Confirm user log out',
    type: Boolean,
  })
  logOutSuccess: boolean;
}

export class AuthRefreshTokenResponseDto {
  @ApiProperty({
    example: true,
    description: 'Confirm refresh token',
    type: Boolean,
  })
  refreshTokenSuccess: boolean;
}
