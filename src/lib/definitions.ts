export interface Product {
  product_id: number;
  name: string;
  price: number;
  in_stock: boolean;
  quantity: number;
}

export interface CartItem {
  product_id: number;
  quantity: number;
  name: string;
  price: number;
}

export interface UserData {
  isLoggedIn: boolean;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string | Date;
  };
}

export interface NextAuthData {
  user?: {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
  };
  expires?: string;
}
