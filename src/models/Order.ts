import { CartItem } from './Cart';

export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  orderId: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  orderDate: Date;
  status: OrderStatus;
}
