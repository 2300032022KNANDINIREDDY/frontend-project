export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'restaurant' | 'delivery';
  phone?: string;
  address?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  isOpen: boolean;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  restaurant: Restaurant;
  items: CartItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';
  totalAmount: number;
  deliveryAddress: string;
  orderTime: Date;
  estimatedDeliveryTime: Date;
  deliveryPersonId?: string;
}

export interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  isAvailable: boolean;
}