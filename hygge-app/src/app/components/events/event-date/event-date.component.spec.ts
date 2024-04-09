import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDateComponent } from './event-date.component';

describe('EventDateComponent', () => {
  let component: EventDateComponent;
  let fixture: ComponentFixture<EventDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
