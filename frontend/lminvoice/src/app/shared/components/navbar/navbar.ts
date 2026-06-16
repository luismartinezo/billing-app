import { Component, ChangeDetectionStrategy, output, input, inject } from '@angular/core';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Navbar {
  private authService = inject(Auth);

  collapsed = input(false);
  toggleSidebar = output<void>();
  logoutRequested = output<void>();
  user = this.authService.getUser();
}
