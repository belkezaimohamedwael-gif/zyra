export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  img: string;         // derived: img_urls[0]
  img_urls: string[];
  tag: string;
  description: string;
  colors: string[];
  stock: boolean;
  featured: boolean;
}

export interface CartItem extends Product {
  cartId: number;
  qty: number;
  selectedSize: number | null;
  selectedColor: string;
}

export interface Order {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  wilaya: string;
  city: string;
  notes: string;
  cart: CartItem[];
  total: number;
  orderNum: string;
}
