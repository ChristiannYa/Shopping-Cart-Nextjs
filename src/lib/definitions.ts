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
    name: string;
    email: string;
    createdAt: string;
  };
}
