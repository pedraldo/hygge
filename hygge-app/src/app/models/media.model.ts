import { Event } from './event.model';
import { User } from './user.model';

export interface Media {
  id: string;
  filename: string;
  etag: string;
  event_id: string;
  creator_id: string;
  is_cover: boolean;
  url?: string;
}

export interface MediaWithRelations extends Media {
  event: Event;
  user: User;
}
