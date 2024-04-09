import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LightgalleryModule } from 'lightgallery/angular';
import lgZoom from 'lightgallery/plugins/zoom';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { Subscription } from 'rxjs';
import { EventDateComponent } from '../../../components/events/event-date/event-date.component';
import { EventInviteUserComponent } from '../../../components/events/event-invite-user/event-invite-user.component';
import { EventsHttpService } from '../../../http/events-http.service';
import { EventWithRelations } from '../../../models/event.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [
    NzPageHeaderModule,
    NzImageModule,
    NzListModule,
    NzAvatarModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    LightgalleryModule,
    EventInviteUserComponent,
    AsyncPipe,
    EventDateComponent,
  ],
  templateUrl: './event.page.html',
  styleUrl: './event.page.scss',
})
export class EventPage implements OnInit, OnDestroy {
  id: string = '';
  event!: EventWithRelations;

  imgs: string[] = [];
  settings = {
    counter: false,
    plugins: [lgZoom],
    showZoomInOutIcons: true,
    zoom: true,
  };

  loading = false;

  isVisible = false;
  selectedUsersIdsToInvite: string[] = [];
  excludedUsersIds: string[] = [];

  subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventsHttpService: EventsHttpService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.id = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.subscriptions.push(
      this.eventsHttpService.getEventById(this.id).subscribe((event) => {
        this.event = event;
        this.imgs = event.medias.reduce((acc, media) => {
          if (media.is_cover) {
            return acc;
          }
          return [...acc, media.url!];
        }, [] as string[]);
        this.loading = false;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.subscriptions = [];
  }

  openInviteUsersModal() {
    this.excludedUsersIds = this.event.users.map((user) => user.id);
    this.isVisible = true;
  }

  handleOk(): void {
    this.subscriptions.push(
      this.eventsHttpService
        .updateUsersConnectionsToEvent(
          this.id,
          this.selectedUsersIdsToInvite,
          true
        )
        .subscribe((event) => {
          this.event.users = event.users;
          this.selectedUsersIdsToInvite = [];
        })
    );
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  onSelectUserToInvite(users: User[]) {
    this.selectedUsersIdsToInvite = users.map((user) => user.id);
  }

  removeUserFromParticipants(userId: string) {
    this.subscriptions.push(
      this.eventsHttpService
        .updateUsersConnectionsToEvent(this.id, [userId], false)
        .subscribe((event) => {
          this.event.users = event.users;
        })
    );
  }
}
