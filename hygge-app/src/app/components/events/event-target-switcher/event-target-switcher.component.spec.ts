import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTargetSwitcherComponent } from './event-target-switcher.component';

describe('EventTargetSwitcherComponent', () => {
  let component: EventTargetSwitcherComponent;
  let fixture: ComponentFixture<EventTargetSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventTargetSwitcherComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventTargetSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
