import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import { TranslationService } from '../../../../core/i18n/translation.service';
import { User, UserUpdateRequest } from '../../../../core/models/user';
import { UserService } from '../../../../core/services/user';

type UserForm = UserUpdateRequest;

@Component({
  selector: 'app-user-management',
  imports: [FormsModule, TranslatePipe],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserManagement {
  private userService = inject(UserService);
  private translationService = inject(TranslationService);

  users = signal<User[]>([]);
  loading = signal(true);
  saving = signal(false);
  searchTerm = signal('');
  editingId = signal<number | null>(null);
  errorMessage = signal('');
  successMessage = signal('');

  form = signal<UserForm>({
    name: '',
    lastname: '',
    email: '',
    username: '',
    admin: false
  });

  filteredUsers = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.users();
    }

    return this.users().filter(user => [
      user.name,
      user.lastname,
      user.email,
      user.username,
      user.roles?.join(' ')
    ].join(' ').toLowerCase().includes(term));
  });

  constructor() {
    this.loadUsers();
  }

  updateTextField(field: keyof Omit<UserForm, 'admin'>, value: string): void {
    this.form.update(form => ({ ...form, [field]: value }));
  }

  updateAdmin(value: boolean): void {
    this.form.update(form => ({ ...form, admin: value }));
  }

  edit(user: User): void {
    this.editingId.set(user.id ?? null);
    this.form.set({
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      username: user.username,
      admin: this.hasRole(user, 'ROLE_ADMIN')
    });
    this.clearMessages();
  }

  submit(): void {
    this.clearMessages();

    if (!this.editingId()) {
      return;
    }

    if (!this.form().name || !this.form().lastname || !this.form().email || !this.form().username) {
      this.errorMessage.set(this.translationService.translate('users.required'));
      return;
    }

    this.saving.set(true);
    this.userService.update(this.editingId()!, this.form()).subscribe({
      next: () => {
        this.successMessage.set(this.translationService.translate('users.updated'));
        this.resetForm();
        this.loadUsers();
        this.saving.set(false);
      },
      error: error => {
        this.errorMessage.set(error?.error?.message || this.translationService.translate('users.saveError'));
        this.saving.set(false);
      }
    });
  }

  remove(user: User): void {
    if (!user.id || this.isOwner(user)) {
      return;
    }

    this.userService.delete(user.id).subscribe({
      next: () => {
        this.successMessage.set(this.translationService.translate('users.deleted'));
        this.loadUsers();
      },
      error: error => this.errorMessage.set(error?.error?.message || this.translationService.translate('users.deleteError'))
    });
  }

  resetForm(): void {
    this.editingId.set(null);
    this.form.set({
      name: '',
      lastname: '',
      email: '',
      username: '',
      admin: false
    });
  }

  isOwner(user: User): boolean {
    return this.hasRole(user, 'ROLE_OWNER');
  }

  roleLabel(role: string): string {
    return this.translationService.translate(`role.${role}`);
  }

  private loadUsers(): void {
    this.loading.set(true);
    this.userService.getAll().subscribe({
      next: users => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set(this.translationService.translate('users.loadError'));
        this.loading.set(false);
      }
    });
  }

  private hasRole(user: User, role: string): boolean {
    return user.roles?.includes(role) ?? false;
  }

  private clearMessages(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
  }
}
