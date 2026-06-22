import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface AppNotification {
  id: number;
  type: NotificationType;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private nextId = 1;
  readonly notifications = signal<AppNotification[]>([]);

  show(message: string, type: NotificationType = 'info', durationMs = 5000): void {
    const alreadyVisible = this.notifications().some(notification =>
      notification.message === message && notification.type === type
    );

    if (alreadyVisible) {
      return;
    }

    const id = this.nextId++;
    this.notifications.update(notifications => [...notifications, { id, type, message }]);

    if (durationMs > 0) {
      setTimeout(() => this.dismiss(id), durationMs);
    }
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error', 6500);
  }

  dismiss(id: number): void {
    this.notifications.update(notifications => notifications.filter(notification => notification.id !== id));
  }
}
