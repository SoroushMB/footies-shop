export interface CartItem {
  productId: string;
  quantity: number;
  price: number; // Price at the time of adding to cart
}

export interface Cart {
  userId: string; // Corresponds to the user's UID
  items: CartItem[];
}
