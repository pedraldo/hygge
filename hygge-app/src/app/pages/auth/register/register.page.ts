import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Subscription } from 'rxjs';
import { AuthHttpService } from '../../../http/auth-http.service';
import { UserRegisterBody } from '../../../models/user.model';

@Component({
  selector: 'app-register',
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
    RouterLink,
  ],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss',
})
export class RegisterPage implements OnDestroy {
  subscriptions: Subscription[] = [];

  validateForm: FormGroup<{
    firstname: FormControl<string>;
    lastname: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
  }> = this.fb.nonNullable.group({
    firstname: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    email: ['', [Validators.required]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        // this.confirmValidator('confirmPassword', true),
      ],
    ],
    confirmPassword: [
      '',
      [Validators.required, this.confirmValidator.bind(this)],
    ],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authHttpService: AuthHttpService
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.subscriptions = [];
  }

  // confirmValidator(matchTo: string, reverse?: boolean): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     console.log('confirm validator');
  //     if (control.parent && reverse) {
  //       return null;
  //     }
  //     return !!control.parent &&
  //       !!control.parent.value &&
  //       control.value === (control.parent?.controls as any)[matchTo].value
  //       ? null
  //       : { confirm: true };
  //   };
  // }

  confirmValidator(control: AbstractControl): { [s: string]: boolean } {
    if (!control.value) {
      return { required: true };
    } else {
      if (control.value !== this.validateForm.controls.password.value) {
        return { confirm: true, error: true };
      }
    }
    return {};
  }

  submitForm() {
    const user: UserRegisterBody = {
      firstname: this.validateForm.controls.firstname.value,
      lastname: this.validateForm.controls.lastname.value,
      email: this.validateForm.controls.email.value,
      password: this.validateForm.controls.password.value,
    };

    this.subscriptions.push(
      // TODO : error and message display handling
      this.authHttpService.signup(user).subscribe(() => {
        this.router.navigateByUrl('/auth/login');
      })
    );
  }
}
