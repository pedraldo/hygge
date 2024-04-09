import { CommonModule, formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-date',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-date.component.html',
  styleUrl: './event-date.component.scss',
})
export class EventDateComponent implements OnInit {
  @Input() startDate!: Date;
  @Input() endDate!: Date;
  @Input() format: 'short' | 'long' = 'short';
  @Input() fontSize: 'small' | 'medium' = 'small';

  formattedStartDate!: string;
  formattedEndDate!: string;

  constructor() {}

  ngOnInit(): void {
    let formatStartDate = 'E d MMM y';
    let formatEndDate = 'd MMM y';

    if (this.format === 'long') {
      formatStartDate += ', HH:mm';
      formatEndDate = 'E d MMM y, HH:mm';
    }
    this.formattedStartDate = formatDate(this.startDate, formatStartDate, 'fr');
    this.formattedEndDate = formatDate(this.endDate, formatEndDate, 'fr');
  }
}
