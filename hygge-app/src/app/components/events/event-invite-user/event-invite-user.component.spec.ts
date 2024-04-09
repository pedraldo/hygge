import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventInviteUserComponent } from './event-invite-user.component';

describe('EventInviteUserComponent', () => {
  let component: EventInviteUserComponent;
  let fixture: ComponentFixture<EventInviteUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventInviteUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventInviteUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
