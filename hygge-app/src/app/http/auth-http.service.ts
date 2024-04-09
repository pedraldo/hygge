import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AuthLogOutResponseDto,
  AuthRefreshTokenResponse,
} from '../models/auth.model';
import {
  User,
  UserLoginBody,
  UserLoginResponse,
  UserRegisterBody,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthHttpService {
  constructor(private http: HttpClient) {}

  signup(user: UserRegisterBody) {
    return this.http.post<User>('@api/auth/signup', user, {
      withCredentials: true,
    });
  }

  login(user: UserLoginBody) {
    return this.http.post<UserLoginResponse>('@api/auth/login', user, {
      withCredentials: true,
    });
  }

  refreshToken() {
    return this.http.get<AuthRefreshTokenResponse>('@api/auth/refresh-token', {
      withCredentials: true,
    });
  }

  logout() {
    return this.http.post<AuthLogOutResponseDto>(
      '@api/auth/logout',
      {},
      {
        withCredentials: true,
      }
    );
  }

  getCurrentUser() {
    return this.http.get<User>('@api/auth/current', {
      withCredentials: true,
    });
  }
}
