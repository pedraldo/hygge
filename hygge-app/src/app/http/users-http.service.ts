import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersHttpService {
  constructor(private http: HttpClient) {}

  getAllUsers() {
    return this.http.get<User[]>('@api/users', {
      withCredentials: true,
    });
  }

  defineCurrentUserTargetEvent(eventId: string) {
    return this.http.post<User>(
      `@api/users/target-event/${eventId}`,
      {},
      {
        withCredentials: true,
      }
    );
  }
}
