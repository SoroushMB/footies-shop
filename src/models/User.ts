export interface User {
  uid: string;
  email: string;
  name: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}
