import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private authService = inject(Auth);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  errorMessage = signal('');
  loading = signal(false);

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
            this.errorMessage.set('The user session could not be obtained.');
          }
        });
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Invalid username or password.');
      }
    });
  }
}
