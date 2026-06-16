import { CurrencyPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product, ProductPayload } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductList {
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  loading = signal(true);
  saving = signal(false);
  searchTerm = signal('');
  editingId = signal<number | null>(null);
  errorMessage = signal('');
  successMessage = signal('');

  form = signal<ProductPayload>({
    name: '',
    description: '',
    price: 0,
    stock: 1
  });

  filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.products();
    }

    return this.products().filter(product => [
      product.name,
      product.description,
      product.price,
      product.stock
    ].join(' ').toLowerCase().includes(term));
  });

  constructor() {
    this.loadProducts();
  }

  updateTextField(field: 'name' | 'description', value: string): void {
    this.form.update(form => ({ ...form, [field]: value }));
  }

  updateNumberField(field: 'price' | 'stock', value: number): void {
    this.form.update(form => ({ ...form, [field]: Number(value) }));
  }

  submit(): void {
    this.clearMessages();

    if (!this.form().name || this.form().price <= 0 || this.form().stock <= 0) {
      this.errorMessage.set('Nombre, precio y stock válido son obligatorios.');
      return;
    }

    this.saving.set(true);
    const request = this.editingId()
      ? this.productService.update(this.editingId()!, this.form())
      : this.productService.create(this.form());

    request.subscribe({
      next: () => {
        this.successMessage.set(this.editingId() ? 'Producto actualizado.' : 'Producto creado.');
        this.resetForm();
        this.loadProducts();
        this.saving.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudo guardar el producto.');
        this.saving.set(false);
      }
    });
  }

  edit(product: Product): void {
    this.editingId.set(product.id ?? null);
    this.form.set({
      name: product.name,
      description: product.description ?? '',
      price: product.price,
      stock: product.stock
    });
    this.clearMessages();
  }

  remove(product: Product): void {
    if (!product.id) {
      return;
    }

    this.productService.delete(product.id).subscribe({
      next: () => {
        this.successMessage.set('Producto eliminado.');
        this.loadProducts();
      },
      error: () => this.errorMessage.set('No se pudo eliminar el producto.')
    });
  }

  resetForm(): void {
    this.editingId.set(null);
    this.form.set({
      name: '',
      description: '',
      price: 0,
      stock: 1
    });
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.productService.getAll().subscribe({
      next: products => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudieron cargar los productos.');
        this.loading.set(false);
      }
    });
  }

  private clearMessages(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
  }
}
