import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class EventCreateDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'New year party',
    description: 'Event name',
    type: String,
  })
  name: string;

  @ApiProperty({
    example: 'Best event ever',
    description: 'Event description',
    type: String,
  })
  description?: string;

  @ApiProperty({
    example: 'assets/example.jpg',
    description: 'Event default cover assets url',
    type: String,
  })
  cover_default?: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '1712149810303',
    description: 'Event start date',
    type: String,
  })
  start_date: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '1712149810303',
    description: 'Event end date',
    type: String,
  })
  end_date: string;

  @ApiProperty({
    example: 'id-number-1,id-number-2,id-number-3',
    description: 'Ids of users invited to the created event',
    type: String,
  })
  users_ids: string;
}

export class EventCreateInput {
  name: string;
  description: string;
  start_date: Date;
  end_date: Date;
  cover: string;
  users_ids: string[];
}

export class EventMainDto {
  @ApiProperty({
    example: 'c8fo0kdd9d2dj5',
    description: 'Event id',
    type: Date,
  })
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: 'New year party',
    description: 'Event name',
    type: String,
  })
  @IsNotEmpty()
  name: string;
}

export class EventAllData {
  id: string;
  name: string;
  cover: string;
  description: string;
  start_date: Date;
  end_date: Date;
  users: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    avatar: string;
  }[];
  medias: {
    id: string;
    filename: string;
    etag: string;
    event_id: string;
    creator_id: string;
    url?: string;
  }[];
}
