import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { BehaviorSubject, Observable, Subscription, switchMap } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { EventCardComponent } from '../../components/events/event-card/event-card.component';
import { EventInviteUserComponent } from '../../components/events/event-invite-user/event-invite-user.component';
import { EventsHttpService } from '../../http/events-http.service';
import { Event, EventCreateInput } from '../../models/event.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    NzModalModule,
    CommonModule,
    EventCardComponent,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzIconModule,
    NzButtonModule,
    NzInputModule,
    NzDatePickerModule,
    NzUploadModule,
    NzMessageModule,
    NzSelectModule,
    NzTimePickerModule,
    EventInviteUserComponent,
  ],
  templateUrl: './events.page.html',
  styleUrl: './events.page.scss',
})
export class EventsPage implements OnInit, OnDestroy {
  events$!: Observable<Event[]>;
  validateForm: FormGroup<{
    name: FormControl<string | null>;
    description: FormControl<string | null>;
    startDate: FormControl<Date | null>;
    startTime: FormControl<Date | null>;
    endDate: FormControl<Date | null>;
    endTime: FormControl<Date | null>;
  }> = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    startDate: new FormControl<Date | null>(null, {
      validators: [Validators.required],
    }),
    startTime: new FormControl<Date | null>(null, {
      validators: [Validators.required],
    }),
    endDate: new FormControl<Date | null>(null, {
      validators: [Validators.required],
    }),
    endTime: new FormControl<Date | null>(null, {
      validators: [Validators.required],
    }),
  });
  isVisible = false;
  fileList: NzUploadFile[] = [];
  searchChange$ = new BehaviorSubject('');
  isLoading = false;
  userProfile!: User;
  selectedUsersIdsToInvite: string[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private msg: NzMessageService,
    private fb: FormBuilder,
    private eventsHttpService: EventsHttpService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.events$ = this.authService.userProfile.pipe(
      switchMap((userProfile) => {
        this.userProfile = userProfile;
        return this.eventsHttpService.getUserEvents(userProfile.id);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.subscriptions = [];
  }

  onSearch(value: string): void {
    this.isLoading = true;
    this.searchChange$.next(value);
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [file];
    return false;
  };

  onSelectUserToInvite(users: User[]) {
    this.selectedUsersIdsToInvite = users.map((user) => user.id);
  }

  submitForm() {
    const name = this.validateForm.controls.name.value;
    const description = this.validateForm.controls.description.value;
    const startDate = this.validateForm.controls.startDate.value;
    const startTime = this.validateForm.controls.startTime.value;
    const endDate = this.validateForm.controls.endDate.value;
    const endTime = this.validateForm.controls.endTime.value;

    const startDateTime = new Date(startDate as Date);
    startDateTime.setHours(new Date(startTime as Date).getHours());
    startDateTime.setMinutes(new Date(startTime as Date).getMinutes());

    const endDateTime = new Date(endDate as Date);
    endDateTime.setHours(new Date(endTime as Date).getHours());
    endDateTime.setMinutes(new Date(endTime as Date).getMinutes());

    const eventInput: EventCreateInput = {
      name: name || '',
      description: description || '',
      start_date: startDateTime,
      end_date: endDateTime,
      users_ids: [this.userProfile.id, ...this.selectedUsersIdsToInvite],
      cover_file: this.fileList.length
        ? (this.fileList[0] as unknown as File)
        : undefined,
      cover_default: this.fileList.length
        ? undefined
        : `assets/event-default-cover-${Math.floor(Math.random() * 3)}.jpg`,
    };

    this.subscriptions.push(
      this.eventsHttpService.create(eventInput).subscribe(({ id }) => {
        this.router.navigate(['/events', id]);
      })
    );
  }
}
