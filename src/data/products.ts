
import { Product } from "../types";

export const products: Product[] = [
  {
    id: "lemonade-classic",
    name: "Classic Lemonade",
    description: "Our original recipe with the perfect balance of sweet and tart flavors.",
    price: 3.99,
    imageUrl: "/lovable-uploads/728fd164-7561-40f4-bcb1-156caafb7496.png",
    category: "classic"
  },
  {
    id: "lemonade-mint",
    name: "Mint Lemonade",
    description: "A refreshing twist on our classic lemonade with fresh mint leaves.",
    price: 4.49,
    imageUrl: "/mint-lemonade.jpg",
    category: "specialty"
  },
  {
    id: "lemonade-strawberry",
    name: "Strawberry Lemonade",
    description: "Sweet strawberries blended with our classic lemonade for a fruity treat.",
    price: 4.99,
    imageUrl: "/strawberry-lemonade.jpg",
    category: "specialty"
  },
  {
    id: "lemonade-blueberry",
    name: "Blueberry Lemonade",
    description: "Tangy blueberries add a vibrant twist to our refreshing lemonade.",
    price: 4.99,
    imageUrl: "/blueberry-lemonade.jpg",
    category: "specialty"
  },
  {
    id: "lemonade-lavender",
    name: "Lavender Lemonade",
    description: "A floral and delicate blend of lavender essence and our classic lemonade.",
    price: 5.49,
    imageUrl: "/lavender-lemonade.jpg",
    category: "premium"
  },
  {
    id: "lemonade-ginger",
    name: "Ginger Lemonade",
    description: "A spicy kick of ginger combined with our tangy lemonade for a warming sensation.",
    price: 4.79,
    imageUrl: "/ginger-lemonade.jpg",
    category: "specialty"
  },
  {
    id: "lemonade-jaljeera",
    name: "Jaljeera Lemonade",
    description: "Indian-inspired with cumin, mint, and a blend of spices for a unique taste experience.",
    price: 5.29,
    imageUrl: "/jaljeera-lemonade.jpg",
    category: "premium"
  },
  {
    id: "lemonade-cola",
    name: "Cola Lemonade",
    description: "The perfect fusion of cola flavors with our classic lemonade for a refreshing twist.",
    price: 4.79,
    imageUrl: "/cola-lemonade.jpg",
    category: "specialty"
  },
  {
    id: "lemonade-rose",
    name: "Rose Lemonade",
    description: "Delicately perfumed with rose water for a fragrant and exotic lemonade experience.",
    price: 5.49,
    imageUrl: "/rose-lemonade.jpg",
    category: "premium"
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};
