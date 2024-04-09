import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthHttpService } from '../http/auth-http.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authHttpService: AuthHttpService = inject(AuthHttpService);
  const router: Router = inject(Router);

  const handle401Error = (
    req: HttpRequest<any>,
    next: HttpHandlerFn,
    originalError: any
  ) => {
    return authHttpService.refreshToken().pipe(
      switchMap(() => {
        return next(req);
      }),
      catchError((error) => {
        localStorage.removeItem('user-profile');
        router.navigateByUrl('/auth/login');
        return throwError(() => originalError);
      })
    );
  };

  if (req.url.indexOf('/auth/refresh-token') > -1) {
    return next(req);
  }
  return next(req).pipe(
    catchError((error) => {
      if (error.status == 401) {
        return handle401Error(req, next, error);
      } else {
        return throwError(() => error);
      }
    })
  );
};
