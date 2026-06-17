import { ChangeDetectionStrategy, Component, OnDestroy, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { Navbar } from '../../shared/components/navbar/navbar';
import { Sidebar } from '../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Navbar, Sidebar],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShell implements OnDestroy {
  private authService = inject(Auth);
  private router = inject(Router);
  private sessionTimeoutId: ReturnType<typeof setTimeout> | null = null;

  sidebarCollapsed = signal(false);

  constructor() {
    this.scheduleSessionExpiration();
  }

  ngOnDestroy(): void {
    if (this.sessionTimeoutId) {
      clearTimeout(this.sessionTimeoutId);
    }
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update(value => !value);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private scheduleSessionExpiration(): void {
    const remainingMs = this.authService.getSessionRemainingMs();

    if (!remainingMs) {
      this.logout();
      return;
    }

    this.sessionTimeoutId = setTimeout(() => this.logout(), remainingMs);
  }
}
