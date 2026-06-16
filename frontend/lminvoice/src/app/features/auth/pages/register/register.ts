import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import { AppLanguage, TranslationService } from '../../../../core/i18n/translation.service';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Register {
  private authService = inject(Auth);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private translationService = inject(TranslationService);

  registerForm = this.fb.group({
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  errorMessage = signal('');
  successMessage = signal('');
  loading = signal(false);
  language = this.translationService.language;

  setLanguage(language: AppLanguage): void {
    this.translationService.setLanguage(language);
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.registerForm.invalid) {
      this.errorMessage.set(this.translationService.translate('register.validationRequired'));
      return;
    }

    const form = this.registerForm.getRawValue();

    if (form.password !== form.confirmPassword) {
      this.errorMessage.set(this.translationService.translate('register.passwordMismatch'));
      return;
    }

    this.loading.set(true);
    this.authService.register({
      name: form.name ?? '',
      lastname: form.lastname ?? '',
      email: form.email ?? '',
      username: form.username ?? '',
      password: form.password ?? ''
    }).subscribe({
      next: () => {
        this.successMessage.set(this.translationService.translate('register.success'));
        this.loading.set(false);
        setTimeout(() => this.router.navigate(['/login']), 900);
      },
      error: error => {
        this.errorMessage.set(error?.error?.message || this.translationService.translate('register.error'));
        this.loading.set(false);
      }
    });
  }
}
