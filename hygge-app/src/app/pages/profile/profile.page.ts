import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { AuthHttpService } from '../../http/auth-http.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NzAvatarModule,
    NzIconModule,
    NzButtonModule,
    CommonModule,
    AsyncPipe,
  ],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.scss',
})
export class ProfilePage implements OnInit {
  user$!: Observable<User>;

  constructor(
    private authService: AuthService,
    private authHttpService: AuthHttpService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user$ = this.authService.userProfile;
  }

  logout() {
    this.authHttpService.logout().subscribe(() => {
      this.authService.initUserProfile();
      localStorage.removeItem('user-profile');
      this.router.navigateByUrl('/auth/login');
    });
  }
}
