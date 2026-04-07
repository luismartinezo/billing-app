import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { Auth } from '../../../../core/services/auth';
import { User } from '../../../../core/models/user';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard {
  private authService = inject(Auth);
  private router = inject(Router);

  user = signal<User | null>(this.authService.getUser());

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
