import { IsNotEmpty } from 'class-validator';

export class MediaMetadata {
  @IsNotEmpty()
  creator_id: string;

  @IsNotEmpty()
  event_id: string;

  @IsNotEmpty()
  is_cover: boolean;
}

export class MediaCreateDto extends MediaMetadata {
  @IsNotEmpty()
  filename: string;

  @IsNotEmpty()
  etag: string;
}
