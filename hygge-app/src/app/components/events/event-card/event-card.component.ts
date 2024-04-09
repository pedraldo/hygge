import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { Event } from '../../../models/event.model';
import { EventDateComponent } from '../event-date/event-date.component';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [NzCardModule, EventDateComponent],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss',
})
export class EventCardComponent {
  @Input() event!: Event;

  constructor(private router: Router) {}

  public navigateToEventPage(id: string) {
    this.router.navigate(['/events', id]);
  }
}
