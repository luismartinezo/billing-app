import { Injectable, signal } from '@angular/core';

export type AppLanguage = 'es' | 'en';

type TranslationDictionary = Record<string, Record<AppLanguage, string>>;

const STORAGE_KEY = 'lminvoice.language';

const TRANSLATIONS: TranslationDictionary = {
  'app.billingSystem': { es: 'Sistema de facturación', en: 'Billing System' },
  'app.billingPanel': { es: 'Panel de facturación', en: 'Billing panel' },
  'app.operations': { es: 'Operaciones', en: 'Operations' },
  'app.open': { es: 'Abrir', en: 'Open' },
  'app.close': { es: 'Cerrar', en: 'Close' },
  'app.logout': { es: 'Salir', en: 'Logout' },
  'app.language': { es: 'Idioma', en: 'Language' },
  'app.spanish': { es: 'Español', en: 'Spanish' },
  'app.english': { es: 'Inglés', en: 'English' },
  'app.back': { es: 'Volver', en: 'Back' },
  'app.actions': { es: 'Acciones', en: 'Actions' },
  'app.edit': { es: 'Editar', en: 'Edit' },
  'app.delete': { es: 'Eliminar', en: 'Delete' },
  'app.cancel': { es: 'Cancelar', en: 'Cancel' },
  'app.update': { es: 'Actualizar', en: 'Update' },
  'app.creating': { es: 'Guardando...', en: 'Saving...' },
  'app.search': { es: 'Buscar', en: 'Search' },
  'app.list': { es: 'Listado', en: 'List' },
  'app.email': { es: 'Email', en: 'Email' },
  'app.phone': { es: 'Teléfono', en: 'Phone' },
  'app.name': { es: 'Nombre', en: 'Name' },
  'app.description': { es: 'Descripción', en: 'Description' },
  'app.price': { es: 'Precio', en: 'Price' },
  'app.stock': { es: 'Stock', en: 'Stock' },
  'app.total': { es: 'Total', en: 'Total' },
  'app.subtotal': { es: 'Subtotal', en: 'Subtotal' },
  'app.tax': { es: 'IVA 19%', en: 'VAT 19%' },

  'nav.dashboard': { es: 'Dashboard', en: 'Dashboard' },
  'nav.invoices': { es: 'Facturas', en: 'Invoices' },
  'nav.newInvoice': { es: 'Nueva factura', en: 'New invoice' },
  'nav.customers': { es: 'Clientes', en: 'Customers' },
  'nav.products': { es: 'Productos', en: 'Products' },

  'login.welcome': { es: 'Bienvenido a LMInvoice', en: 'Welcome to LMInvoice' },
  'login.subtitle': { es: 'Administra clientes, productos, facturas y pagos desde un solo lugar.', en: 'Manage customers, products, invoices, and payments in one place.' },
  'login.prompt': { es: 'Inicia sesión para continuar.', en: 'Sign in to continue.' },
  'login.username': { es: 'Usuario', en: 'Username' },
  'login.password': { es: 'Contraseña', en: 'Password' },
  'login.submit': { es: 'Ingresar', en: 'Login' },
  'login.loading': { es: 'Ingresando...', en: 'Signing in...' },
  'login.forgotPassword': { es: '¿Olvidaste tu contraseña?', en: 'Forgot password?' },
  'login.noAccount': { es: '¿No tienes una cuenta?', en: 'Do not have an account?' },
  'login.createAccount': { es: 'Crear una cuenta', en: 'Create an account' },
  'login.errorSession': { es: 'No se pudo obtener la sesión del usuario.', en: 'The user session could not be obtained.' },
  'login.errorCredentials': { es: 'Usuario o contraseña inválidos.', en: 'Invalid username or password.' },

  'dashboard.welcome': { es: 'Bienvenido', en: 'Welcome' },
  'dashboard.totalInvoices': { es: 'Total facturas', en: 'Total invoices' },
  'dashboard.registered': { es: 'Registradas en el sistema', en: 'Registered in the system' },
  'dashboard.pending': { es: 'Pendientes', en: 'Pending' },
  'dashboard.pendingHint': { es: 'Por cobrar o gestionar', en: 'To collect or manage' },
  'dashboard.paid': { es: 'Pagadas', en: 'Paid' },
  'dashboard.paidHint': { es: 'Facturas cerradas', en: 'Closed invoices' },
  'dashboard.paidRevenue': { es: 'Ingresos pagados', en: 'Paid revenue' },
  'dashboard.paidRevenueHint': { es: 'Según facturas pagadas', en: 'Based on paid invoices' },
  'dashboard.recentInvoices': { es: 'Últimas facturas', en: 'Recent invoices' },
  'dashboard.recentActivity': { es: 'Actividad reciente', en: 'Recent activity' },
  'dashboard.viewAll': { es: 'Ver todas', en: 'View all' },
  'dashboard.loadingInvoices': { es: 'Cargando facturas...', en: 'Loading invoices...' },
  'dashboard.noInvoices': { es: 'No hay facturas todavía', en: 'There are no invoices yet' },
  'dashboard.createFirstInvoice': { es: 'Crea la primera factura para activar las métricas.', en: 'Create the first invoice to activate the metrics.' },
  'dashboard.createInvoice': { es: 'Crear factura', en: 'Create invoice' },
  'dashboard.agentSubtitle': { es: 'Consultas locales del negocio', en: 'Local business queries' },
  'dashboard.quickPending': { es: 'Pendientes', en: 'Pending' },
  'dashboard.quickPaid': { es: 'Pagadas', en: 'Paid' },
  'dashboard.quickRevenue': { es: 'Ingresos', en: 'Revenue' },
  'dashboard.quickTopClients': { es: 'Top clientes', en: 'Top clients' },
  'dashboard.ask': { es: 'Preguntar', en: 'Ask' },
  'dashboard.asking': { es: 'Consultando...', en: 'Asking...' },
  'dashboard.selectQuickQuery': { es: 'Selecciona una consulta rápida.', en: 'Select a quick query.' },
  'dashboard.agentError': { es: 'No se pudo consultar el agente local.', en: 'The local agent could not be queried.' },

  'invoice.section': { es: 'Facturación', en: 'Billing' },
  'invoice.single': { es: 'Factura', en: 'Invoice' },
  'invoice.title': { es: 'Facturas', en: 'Invoices' },
  'invoice.description': { es: 'Control de estados, totales y actividad comercial.', en: 'Track statuses, totals, and business activity.' },
  'invoice.new': { es: 'Nueva factura', en: 'New invoice' },
  'invoice.searchPlaceholder': { es: 'Número, cliente o estado', en: 'Number, customer, or status' },
  'invoice.number': { es: 'Número', en: 'Number' },
  'invoice.customer': { es: 'Cliente', en: 'Customer' },
  'invoice.status': { es: 'Estado', en: 'Status' },
  'invoice.view': { es: 'Ver', en: 'View' },
  'invoice.payment': { es: 'Pago', en: 'Payment' },
  'invoice.noNumber': { es: 'Sin número', en: 'No number' },
  'invoice.noCustomer': { es: 'Sin cliente', en: 'No customer' },
  'invoice.empty': { es: 'No hay facturas para mostrar', en: 'There are no invoices to show' },
  'invoice.emptyHint': { es: 'Ajusta los filtros o crea una nueva factura.', en: 'Adjust the filters or create a new invoice.' },
  'invoice.backToInvoices': { es: 'Volver a facturas', en: 'Back to invoices' },
  'invoice.formTitle': { es: 'Nueva factura', en: 'New invoice' },
  'invoice.formDescription': { es: 'Selecciona cliente, productos y cantidades para generar la factura.', en: 'Select customer, products, and quantities to generate the invoice.' },
  'invoice.formData': { es: 'Datos de la factura', en: 'Invoice data' },
  'invoice.formDataHint': { es: 'Cliente y líneas de producto', en: 'Customer and product lines' },
  'invoice.loadingCatalogs': { es: 'Cargando clientes y productos...', en: 'Loading customers and products...' },
  'invoice.selectCustomer': { es: 'Selecciona un cliente', en: 'Select a customer' },
  'invoice.noPhone': { es: 'Sin teléfono registrado', en: 'No phone registered' },
  'invoice.noSelectedCustomer': { es: 'Sin cliente seleccionado', en: 'No customer selected' },
  'invoice.chooseCustomer': { es: 'Elige un cliente para continuar.', en: 'Choose a customer to continue.' },
  'invoice.products': { es: 'Productos', en: 'Products' },
  'invoice.addLine': { es: 'Agregar línea', en: 'Add line' },
  'invoice.product': { es: 'Producto', en: 'Product' },
  'invoice.quantity': { es: 'Cantidad', en: 'Quantity' },
  'invoice.selectProduct': { es: 'Selecciona producto', en: 'Select product' },
  'invoice.noSelectedProduct': { es: 'Producto sin seleccionar', en: 'No product selected' },
  'invoice.summary': { es: 'Resumen', en: 'Summary' },
  'invoice.totalInvoice': { es: 'Total factura', en: 'Invoice total' },
  'invoice.save': { es: 'Guardar factura', en: 'Save invoice' },
  'invoice.created': { es: 'Factura creada correctamente.', en: 'Invoice created successfully.' },
  'invoice.viewInvoices': { es: 'Ver facturas', en: 'View invoices' },
  'invoice.validationCustomer': { es: 'Selecciona un cliente.', en: 'Select a customer.' },
  'invoice.validationItems': { es: 'Selecciona productos y cantidades válidas.', en: 'Select valid products and quantities.' },
  'invoice.saveError': { es: 'No se pudo guardar la factura.', en: 'The invoice could not be saved.' },
  'invoice.catalogsError': { es: 'No se pudieron cargar clientes y productos.', en: 'Customers and products could not be loaded.' },
  'invoice.detail': { es: 'Detalle', en: 'Detail' },
  'invoice.unassignedCustomer': { es: 'Cliente sin asignar', en: 'Unassigned customer' },
  'invoice.openPdf': { es: 'Abrir PDF', en: 'Open PDF' },
  'invoice.openingPdf': { es: 'Abriendo...', en: 'Opening...' },
  'invoice.summaryHint': { es: 'Estado, fechas y totales', en: 'Status, dates, and totals' },
  'invoice.createdAt': { es: 'Creada', en: 'Created' },
  'invoice.issueDate': { es: 'Emisión', en: 'Issue date' },
  'invoice.dueDate': { es: 'Vencimiento', en: 'Due date' },
  'invoice.taxes': { es: 'Impuestos', en: 'Taxes' },
  'invoice.registerPayment': { es: 'Registrar pago', en: 'Register payment' },
  'invoice.balanceDue': { es: 'Saldo pendiente', en: 'Balance due' },
  'invoice.amount': { es: 'Monto', en: 'Amount' },
  'invoice.method': { es: 'Método', en: 'Method' },
  'invoice.cash': { es: 'Efectivo', en: 'Cash' },
  'invoice.transfer': { es: 'Transferencia', en: 'Transfer' },
  'invoice.card': { es: 'Tarjeta', en: 'Card' },
  'invoice.registering': { es: 'Registrando...', en: 'Registering...' },
  'invoice.items': { es: 'Items', en: 'Items' },
  'invoice.itemsHint': { es: 'Productos facturados', en: 'Invoiced products' },
  'invoice.payments': { es: 'Pagos', en: 'Payments' },
  'invoice.paymentCount': { es: 'pagos registrados', en: 'registered payments' },
  'invoice.noPayments': { es: 'No hay pagos registrados.', en: 'There are no registered payments.' },
  'invoice.paymentAmountError': { es: 'Ingresa un monto de pago válido.', en: 'Enter a valid payment amount.' },
  'invoice.paymentCreated': { es: 'Pago registrado correctamente.', en: 'Payment registered successfully.' },
  'invoice.paymentError': { es: 'No se pudo registrar el pago.', en: 'The payment could not be registered.' },
  'invoice.pdfError': { es: 'No se pudo abrir el PDF de la factura.', en: 'The invoice PDF could not be opened.' },
  'invoice.loadError': { es: 'No se pudo cargar la factura.', en: 'The invoice could not be loaded.' },
  'invoice.paymentsLoadError': { es: 'No se pudieron cargar los pagos.', en: 'Payments could not be loaded.' },

  'customer.catalog': { es: 'Catálogo', en: 'Catalog' },
  'customer.title': { es: 'Clientes', en: 'Customers' },
  'customer.description': { es: 'Administra los datos de facturación de tus clientes.', en: 'Manage your customers billing data.' },
  'customer.edit': { es: 'Editar cliente', en: 'Edit customer' },
  'customer.new': { es: 'Nuevo cliente', en: 'New customer' },
  'customer.formHint': { es: 'Información de contacto y facturación', en: 'Contact and billing information' },
  'customer.firstName': { es: 'Nombre', en: 'First name' },
  'customer.lastName': { es: 'Apellido', en: 'Last name' },
  'customer.address': { es: 'Dirección', en: 'Address' },
  'customer.create': { es: 'Crear cliente', en: 'Create customer' },
  'customer.registered': { es: 'clientes registrados', en: 'registered customers' },
  'customer.search': { es: 'Buscar cliente', en: 'Search customer' },
  'customer.noAddress': { es: 'Sin dirección', en: 'No address' },
  'customer.empty': { es: 'No hay clientes para mostrar.', en: 'There are no customers to show.' },
  'customer.required': { es: 'Nombre, apellido y email son obligatorios.', en: 'First name, last name, and email are required.' },
  'customer.created': { es: 'Cliente creado.', en: 'Customer created.' },
  'customer.updated': { es: 'Cliente actualizado.', en: 'Customer updated.' },
  'customer.deleted': { es: 'Cliente eliminado.', en: 'Customer deleted.' },
  'customer.saveError': { es: 'No se pudo guardar el cliente.', en: 'The customer could not be saved.' },
  'customer.deleteError': { es: 'No se pudo eliminar el cliente.', en: 'The customer could not be deleted.' },
  'customer.loadError': { es: 'No se pudieron cargar los clientes.', en: 'Customers could not be loaded.' },
  'customer.loading': { es: 'Cargando clientes...', en: 'Loading customers...' },

  'product.catalog': { es: 'Catálogo', en: 'Catalog' },
  'product.title': { es: 'Productos', en: 'Products' },
  'product.description': { es: 'Administra servicios, precios y stock disponible.', en: 'Manage services, prices, and available stock.' },
  'product.edit': { es: 'Editar producto', en: 'Edit product' },
  'product.new': { es: 'Nuevo producto', en: 'New product' },
  'product.formHint': { es: 'Datos comerciales del producto', en: 'Product commercial data' },
  'product.create': { es: 'Crear producto', en: 'Create product' },
  'product.registered': { es: 'productos registrados', en: 'registered products' },
  'product.search': { es: 'Buscar producto', en: 'Search product' },
  'product.noDescription': { es: 'Sin descripción', en: 'No description' },
  'product.empty': { es: 'No hay productos para mostrar.', en: 'There are no products to show.' },
  'product.required': { es: 'Nombre, precio y stock válido son obligatorios.', en: 'Name, price, and valid stock are required.' },
  'product.created': { es: 'Producto creado.', en: 'Product created.' },
  'product.updated': { es: 'Producto actualizado.', en: 'Product updated.' },
  'product.deleted': { es: 'Producto eliminado.', en: 'Product deleted.' },
  'product.saveError': { es: 'No se pudo guardar el producto.', en: 'The product could not be saved.' },
  'product.deleteError': { es: 'No se pudo eliminar el producto.', en: 'The product could not be deleted.' },
  'product.loadError': { es: 'No se pudieron cargar los productos.', en: 'Products could not be loaded.' },
  'product.loading': { es: 'Cargando productos...', en: 'Loading products...' },

  'status.ALL': { es: 'TODOS', en: 'ALL' },
  'status.PENDING': { es: 'PENDIENTE', en: 'PENDING' },
  'status.PAID': { es: 'PAGADA', en: 'PAID' },
  'status.CANCELLED': { es: 'CANCELADA', en: 'CANCELLED' },
  'status.ISSUED': { es: 'EMITIDA', en: 'ISSUED' },
  'status.UNKNOWN': { es: 'DESCONOCIDO', en: 'UNKNOWN' }
};

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  readonly language = signal<AppLanguage>(this.getInitialLanguage());

  setLanguage(language: AppLanguage): void {
    this.language.set(language);
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }

  translate(key: string): string {
    return TRANSLATIONS[key]?.[this.language()] ?? key;
  }

  private getInitialLanguage(): AppLanguage {
    const savedLanguage = localStorage.getItem(STORAGE_KEY);

    if (savedLanguage === 'es' || savedLanguage === 'en') {
      document.documentElement.lang = savedLanguage;
      return savedLanguage;
    }

    document.documentElement.lang = 'es';
    return 'es';
  }
}
