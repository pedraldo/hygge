import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Event,
  EventCreateInput,
  EventInviteUsersResponse,
  EventWithRelations,
} from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventsHttpService {
  constructor(private http: HttpClient) {}

  getUserEvents(userId: string) {
    return this.http.get<Event[]>(`@api/events?userId=${userId}`, {
      withCredentials: true,
    });
  }

  getUserEventsName(userId: string) {
    return this.http.get<Pick<Event, 'id' | 'name'>[]>(
      `@api/events?userId=${userId}&short=true`,
      {
        withCredentials: true,
      }
    );
  }

  getEventById(id: string) {
    return this.http.get<EventWithRelations>(`@api/events/${id}`, {
      withCredentials: true,
    });
  }

  getEventNameById(id: string) {
    return this.http.get<Pick<Event, 'id' | 'name'>>(
      `@api/events/${id}?short=true`,
      {
        withCredentials: true,
      }
    );
  }

  updateUsersConnectionsToEvent(
    eventId: string,
    usersIds: string[],
    isConnection: boolean
  ) {
    return this.http.post<EventInviteUsersResponse>(
      `@api/events/${eventId}/users-connections`,
      { usersIds, isConnection },
      {
        withCredentials: true,
      }
    );
  }

  create(eventInput: EventCreateInput) {
    const {
      name,
      description,
      cover_file,
      cover_default,
      start_date,
      end_date,
      users_ids,
    } = eventInput;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description || '');
    formData.append('start_date', Date.parse(start_date.toString()).toString()),
      formData.append('end_date', Date.parse(end_date.toString()).toString()),
      formData.append('users_ids', users_ids.join(','));

    if (!!cover_file) {
      formData.append('file', cover_file, cover_file.name);
    } else if (cover_default) {
      formData.append('cover_default', cover_default);
    }

    return this.http.post<{ id: string }>('@api/events', formData, {
      withCredentials: true,
    });
  }
}
