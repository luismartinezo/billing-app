export interface User {
  id?: number;
  username: string;
  email: string;
  name: string;
  lastname: string;
  roles: string[];
}

export interface UserUpdateRequest {
  name: string;
  lastname: string;
  email: string;
  username: string;
  admin: boolean;
}
