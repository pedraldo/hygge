import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Subscription } from 'rxjs';
import { UsersHttpService } from '../../../http/users-http.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-event-invite-user',
  standalone: true,
  imports: [
    NzAvatarModule,
    NzIconModule,
    NzSelectModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './event-invite-user.component.html',
  styleUrl: './event-invite-user.component.scss',
})
export class EventInviteUserComponent implements OnInit, OnDestroy {
  @Input() excludedUsersIds: string[] = [];
  @Output() selectUser = new EventEmitter<User[]>();

  selectedUsers: User[] = [];
  users: User[] = [];
  filteredUsers: User[] = [];
  isLoading = false;
  isValueTooShort = true;
  subscription!: Subscription;

  constructor(private usersHttpService: UsersHttpService) {}

  ngOnInit(): void {
    // TODO : instead of getting all users in ngOnInit, request users in onSearch if value > 3 and get match results
    this.subscription = this.usersHttpService
      .getAllUsers()
      .subscribe((users) => {
        this.users = users;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSearch(value: string) {
    if (value.length > 2) {
      this.isLoading = true;
      this.isValueTooShort = false;

      this.filteredUsers = this.users.filter((user) => {
        const lcUserFirstname = user.firstname.toLowerCase();
        const lcUserLastname = user.lastname.toLowerCase();
        const lcValue = value.toLowerCase();
        return (
          !this.excludedUsersIds.includes(user.id) &&
          (lcUserFirstname.includes(lcValue) ||
            lcUserLastname.includes(lcValue) ||
            `${lcUserFirstname} ${lcUserLastname}`.includes(lcValue))
        );
      });
      this.isLoading = false;
    } else {
      this.isValueTooShort = true;
      this.filteredUsers = [];
    }
  }
}
