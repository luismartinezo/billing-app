export interface Customer {
  id?: number;
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  address?: string;
  phone?: string;
}

export interface CustomerPayload {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: string;
}
