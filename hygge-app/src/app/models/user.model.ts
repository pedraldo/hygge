import { Event } from './event.model';

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  avatar: string;
  target_event?: Pick<Event, 'id' | 'name'>;
}

export interface UserLoginBody {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  user: User;
  token: string;
}

export interface UserRegisterBody
  extends Pick<User, 'firstname' | 'lastname'>,
    UserLoginBody {}
