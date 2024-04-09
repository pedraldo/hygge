import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private initUserProfileData = {
    id: '',
    firstname: '',
    lastname: '',
    email: '',
    avatar: '',
    target_event: undefined,
  };
  userProfile: BehaviorSubject<User> = new BehaviorSubject<User>(
    this.initUserProfileData
  );

  constructor() {}

  saveUserToLocalStorage(user: User) {
    this.userProfile.next(user);
    localStorage.setItem('user-profile', JSON.stringify(user));
  }

  getUserFromLocalStorage(): User {
    if (!this.userProfile.value.id) {
      let lsUser = localStorage.getItem('user-profile');
      if (lsUser) {
        let userInfo = JSON.parse(lsUser);
        this.userProfile.next(userInfo);
      }
    }
    return this.userProfile.value;
  }

  initUserProfile() {
    this.userProfile.next(this.initUserProfileData);
  }
}
