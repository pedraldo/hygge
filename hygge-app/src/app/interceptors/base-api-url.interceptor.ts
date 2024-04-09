import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const baseApiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  let requestUrl = req.url;
  if (requestUrl.indexOf('@api') !== -1) {
    const split = location.origin.split(':');
    const origin = `${split[0]}:${split[1]}`;
    requestUrl = requestUrl.replace(
      '@api/',
      `${origin}:${environment.apiPort}/`
    );
    // requestUrl = requestUrl.replace('@api/', environment.baseApiUrl);
  }
  const apiRequest = req.clone({ url: requestUrl });
  return next(apiRequest);
};
