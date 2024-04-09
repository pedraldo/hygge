import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import fr from '@angular/common/locales/fr';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  CalendarOutline,
  CameraOutline,
  CloseOutline,
  LockOutline,
  PlusOutline,
  SwapOutline,
  UserAddOutline,
  UserOutline,
} from '@ant-design/icons-angular/icons';
import { fr_FR, provideNzI18n } from 'ng-zorro-antd/i18n';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { routes } from './app.routes';
import { authInterceptor } from './auth/auth.interceptor';
import { baseApiUrlInterceptor } from './interceptors/base-api-url.interceptor';

registerLocaleData(fr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideNzI18n(fr_FR),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([baseApiUrlInterceptor, authInterceptor])
    ),
    importProvidersFrom(
      NzIconModule.forRoot([
        CalendarOutline,
        UserOutline,
        CameraOutline,
        SwapOutline,
        PlusOutline,
        UserAddOutline,
        LockOutline,
        CloseOutline,
      ])
    ),
  ],
};
