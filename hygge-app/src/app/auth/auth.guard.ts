import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  const userProfile = authService.getUserFromLocalStorage();

  if (!!userProfile.id) {
    return true;
  }
  router.navigateByUrl('/auth/login');
  return false;
};
