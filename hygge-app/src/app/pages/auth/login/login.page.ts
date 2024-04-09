import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { AuthService } from '../../../auth/auth.service';
import { AuthHttpService } from '../../../http/auth-http.service';
import { UserLoginResponse } from '../../../models/user.model';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzGridModule,
    NzCheckboxModule,
    NzSpinModule,
    RouterLink,
    NzMessageModule,
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  isSpinning = false;

  validateForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }> = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private authHttpService: AuthHttpService,
    private router: Router,
    private message: NzMessageService
  ) {}

  submitForm(): void {
    if (this.validateForm.valid) {
      const credentials = {
        email: this.validateForm.controls.email.value,
        password: this.validateForm.controls.password.value,
      };
      this.authHttpService.login(credentials).subscribe({
        next: (response: UserLoginResponse) => {
          this.authService.saveUserToLocalStorage(response.user);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error(error);
          this.message.create('error', 'Email et/ou mot de passe incorrects.');
        },
      });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
