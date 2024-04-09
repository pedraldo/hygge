import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { EventTargetSwitcherComponent } from '../../../components/events/event-target-switcher/event-target-switcher.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NzIconModule, NzButtonModule, EventTargetSwitcherComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
