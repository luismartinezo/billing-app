import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Auth } from '../services/auth';
import { NotificationService } from '../services/notification.service';
import { TranslationService } from '../i18n/translation.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  const translationService = inject(TranslationService);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401 && token) {
        authService.logout();
        notificationService.error(translationService.translate('error.sessionExpired'));
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
