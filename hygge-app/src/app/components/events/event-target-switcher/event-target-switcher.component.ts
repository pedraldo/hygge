import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Observable, map } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { EventsHttpService } from '../../../http/events-http.service';
import { UsersHttpService } from '../../../http/users-http.service';
import { Event } from '../../../models/event.model';

@Component({
  selector: 'app-event-target-switcher',
  standalone: true,
  imports: [
    NzModalModule,
    NzIconModule,
    NzSelectModule,
    NzButtonModule,
    FormsModule,
    NzButtonModule,
    AsyncPipe,
  ],
  templateUrl: './event-target-switcher.component.html',
  styleUrl: './event-target-switcher.component.scss',
})
export class EventTargetSwitcherComponent implements OnInit {
  isVisible = false;
  selectedValue: Pick<Event, 'id' | 'name'> = {
    id: '',
    name: '',
  };
  // events = [
  //   { id: 'a', name: 'Event A' },
  //   { id: 'b', name: 'Event B' },
  //   {
  //     id: 'c',
  //     name: 'Event C avec un nom hyper long à double rallonge extensible',
  //   },
  //   { id: 'd', name: 'Event D' },
  // ];
  targetEvent$!: Observable<Pick<Event, 'id' | 'name'> | null>;
  events$!: Observable<Pick<Event, 'id' | 'name'>[]>;
  currentUserId!: string;
  currentTargetEventId!: string;

  constructor(
    private eventsHttpService: EventsHttpService,
    private authService: AuthService,
    private usersHttpService: UsersHttpService
  ) {}

  ngOnInit(): void {
    this.targetEvent$ = this.authService.userProfile.pipe(
      map((user) => {
        this.currentUserId = user.id;
        if (user.target_event) {
          this.selectedValue = user.target_event;
          this.currentTargetEventId = user.target_event.id;
        }
        return user.target_event || null;
      })
    );
  }

  showModal(): void {
    this.isVisible = true;
    this.events$ = this.eventsHttpService.getUserEventsName(this.currentUserId);
  }

  handleOk(): void {
    if (this.selectedValue.id !== this.currentTargetEventId) {
      this.usersHttpService
        .defineCurrentUserTargetEvent(this.selectedValue.id)
        .subscribe((user) => {
          this.authService.saveUserToLocalStorage(user);
          this.currentTargetEventId = this.selectedValue.id;
        });
    }
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
