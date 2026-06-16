import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Customer, CustomerPayload } from '../../models/customer';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-list',
  imports: [FormsModule],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerList {
  private customerService = inject(CustomerService);

  customers = signal<Customer[]>([]);
  loading = signal(true);
  saving = signal(false);
  searchTerm = signal('');
  editingId = signal<number | null>(null);
  errorMessage = signal('');
  successMessage = signal('');

  form = signal<CustomerPayload>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phone: ''
  });

  filteredCustomers = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.customers();
    }

    return this.customers().filter(customer => [
      customer.name,
      customer.firstName,
      customer.lastName,
      customer.email,
      customer.phone
    ].join(' ').toLowerCase().includes(term));
  });

  constructor() {
    this.loadCustomers();
  }

  updateField(field: keyof CustomerPayload, value: string): void {
    this.form.update(form => ({ ...form, [field]: value }));
  }

  submit(): void {
    this.clearMessages();

    if (!this.form().firstName || !this.form().lastName || !this.form().email) {
      this.errorMessage.set('Nombre, apellido y email son obligatorios.');
      return;
    }

    this.saving.set(true);
    const request = this.editingId()
      ? this.customerService.update(this.editingId()!, this.form())
      : this.customerService.create(this.form());

    request.subscribe({
      next: () => {
        this.successMessage.set(this.editingId() ? 'Cliente actualizado.' : 'Cliente creado.');
        this.resetForm();
        this.loadCustomers();
        this.saving.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudo guardar el cliente.');
        this.saving.set(false);
      }
    });
  }

  edit(customer: Customer): void {
    this.editingId.set(customer.id ?? null);
    this.form.set({
      firstName: customer.firstName ?? customer.name?.split(' ')[0] ?? '',
      lastName: customer.lastName ?? customer.name?.split(' ').slice(1).join(' ') ?? '',
      email: customer.email,
      address: customer.address ?? '',
      phone: customer.phone ?? ''
    });
    this.clearMessages();
  }

  remove(customer: Customer): void {
    if (!customer.id) {
      return;
    }

    this.customerService.delete(customer.id).subscribe({
      next: () => {
        this.successMessage.set('Cliente eliminado.');
        this.loadCustomers();
      },
      error: () => this.errorMessage.set('No se pudo eliminar el cliente.')
    });
  }

  resetForm(): void {
    this.editingId.set(null);
    this.form.set({
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      phone: ''
    });
  }

  private loadCustomers(): void {
    this.loading.set(true);
    this.customerService.getAll().subscribe({
      next: customers => {
        this.customers.set(customers);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudieron cargar los clientes.');
        this.loading.set(false);
      }
    });
  }

  private clearMessages(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
  }
}
