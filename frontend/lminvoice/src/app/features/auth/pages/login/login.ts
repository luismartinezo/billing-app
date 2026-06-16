import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../../core/services/auth';
import { AppLanguage, TranslationService } from '../../../../core/i18n/translation.service';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private authService = inject(Auth);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private translationService = inject(TranslationService);

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  errorMessage = signal('');
  loading = signal(false);
  language = this.translationService.language;

  setLanguage(language: AppLanguage): void {
    this.translationService.setLanguage(language);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.errorMessage.set('');
    this.loading.set(true);

    const credentials = this.loginForm.getRawValue();
    
    this.authService.login(credentials as any).subscribe({
      next: () => {
        this.authService.getMe().subscribe({
          next: (user) => {
            this.authService.saveUser(user);
            this.loading.set(false);
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            this.loading.set(false);
            this.errorMessage.set(this.translationService.translate('login.errorSession'));
          }
        });
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set(this.translationService.translate('login.errorCredentials'));
      }
    });
  }
}
