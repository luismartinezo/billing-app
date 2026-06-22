import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { TranslationService } from '../i18n/translation.service';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const translationService = inject(TranslationService);

  return next(req).pipe(
    catchError(error => {
      if (error.status === 0) {
        notificationService.error(translationService.translate('error.network'));
      } else if (error.status === 403) {
        notificationService.error(translationService.translate('error.forbidden'));
      } else if (error.status >= 500) {
        notificationService.error(translationService.translate('error.server'));
      }

      return throwError(() => error);
    })
  );
};
