import { Media } from './media.model';
import { User } from './user.model';

export interface Event {
  id: string;
  name: string;
  cover?: string;
  description?: string;
  start_date: Date;
  end_date: Date;
}

interface Event_Relations {
  users: User[];
  medias: Media[];
}

export interface EventWithRelations extends Event, Event_Relations {}

export interface EventInviteUsersResponse
  extends Pick<Event, 'id' | 'name'>,
    Pick<Event_Relations, 'users'> {}

export interface EventCreateInput extends Omit<Event, 'id' | 'cover'> {
  cover_file?: File;
  cover_default?: string;
  users_ids: string[];
}
