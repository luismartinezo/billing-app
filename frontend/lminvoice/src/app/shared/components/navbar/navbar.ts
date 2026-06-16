import { Component, ChangeDetectionStrategy, output, input, inject } from '@angular/core';
import { Auth } from '../../../core/services/auth';
import { AppLanguage, TranslationService } from '../../../core/i18n/translation.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-navbar',
  imports: [TranslatePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Navbar {
  private authService = inject(Auth);
  private translationService = inject(TranslationService);

  collapsed = input(false);
  toggleSidebar = output<void>();
  logoutRequested = output<void>();
  user = this.authService.getUser();
  language = this.translationService.language;

  setLanguage(language: AppLanguage): void {
    this.translationService.setLanguage(language);
  }
}
