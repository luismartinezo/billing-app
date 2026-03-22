import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../../core/services/auth';
import { LoginRequest } from '../../../../core/models/login-request';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  credentials: LoginRequest = {
    username: '',
    password: ''
  };

  errorMessage = '';
  loading = false;

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.loading = true;

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.authService.getMe().subscribe({
          next: (user) => {
            this.authService.saveUser(user);
            this.loading = false;
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            this.loading = false;
            this.errorMessage = 'The user session could not be obtained.';
          }
        });
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Invalid username or password.';
      }
    });
  }
}
