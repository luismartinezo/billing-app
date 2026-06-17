import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sidebar {
  private authService = inject(Auth);

  collapsed = input(false);
  isAdmin = this.authService.hasAnyRole(['ROLE_OWNER', 'ROLE_ADMIN']);
  isOwner = this.authService.hasRole('ROLE_OWNER');
}
