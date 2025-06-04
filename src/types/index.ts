
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  email: string;
  phoneNumber: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  shippingAddress: ShippingAddress;
  status: "pending" | "processing" | "shipped" | "delivered";
  createdAt: string;
  isQuickMode?: boolean;
}

export interface GameState {
  position: { x: number; y: number };
  score: number;
  level: number;
  lives: number;
  gameStatus: "playing" | "paused" | "gameOver" | "won";
  obstacles: Array<{ x: number; y: number; width: number; height: number }>;
  collectibles: Array<{ x: number; y: number; collected: boolean }>;
}
