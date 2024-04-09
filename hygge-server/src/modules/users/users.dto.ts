import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { EventMainDto } from '../events/events.dto';

export class UserResponseDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 123,
    description: 'User unique id',
    type: String,
  })
  id: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'John',
    description: 'User first name',
    type: String,
  })
  firstname: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
    type: String,
  })
  lastname: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'email@email.com',
    description: 'User email',
    type: String,
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'http://imgbank.com/image.jpg',
    description: 'User avatar url',
    type: String,
  })
  avatar: string;

  @ApiProperty({
    example: '',
    description: 'User target event',
    type: EventMainDto,
  })
  target_event?: EventMainDto;
}

export class UserCreatePayload {
  @ApiProperty({
    example: 'John',
    description: 'User first name',
    type: String,
  })
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
    type: String,
  })
  @IsNotEmpty()
  lastname: string;

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

export class UserCreateDto extends UserCreatePayload {
  avatar: string;
}
