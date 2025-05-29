import { Product } from "../types";

// Initial product data
const initialProducts: Product[] = [
  {
    id: "lemonade-classic",
    name: "Classic Lemonade",
    description: "Our original recipe with the perfect balance of sweet and tart flavors.",
    price: 3.99,
    imageUrl: "/lovable-uploads/728fd164-7561-40f4-bcb1-156caafb7496.png",
    category: "classic",
    inStock: true
  },
  {
    id: "lemonade-mint",
    name: "Mint Lemonade",
    description: "A refreshing twist on our classic lemonade with fresh mint leaves.",
    price: 4.49,
    imageUrl: "https://img.freepik.com/free-photo/green-cocktail-with-mint-ice-cubes-lemon-slice_114579-3402.jpg?t=st=1747285781~exp=1747289381~hmac=24de1a3ac989fd6f9a9eabce55798899575c04936041abc333b0090582f67dfd&w=826",
    category: "specialty",
    inStock: true
  },
  {
    id: "lemonade-strawberry",
    name: "Strawberry Lemonade",
    description: "Sweet strawberries blended with our classic lemonade for a fruity treat.",
    price: 4.99,
    imageUrl: "https://img.freepik.com/free-photo/strawberry-lemonade-table_140725-5482.jpg?t=st=1747286154~exp=1747289754~hmac=60d581f55087e96a9861ff7a1515088203a2d3e1bb153354cd4aab958e35501b&w=826",
    category: "specialty",
    inStock: true
  },
  {
    id: "lemonade-blueberry",
    name: "Blueberry Lemonade",
    description: "Tangy blueberries add a vibrant twist to our refreshing lemonade.",
    price: 4.99,
    imageUrl: "https://img.freepik.com/free-photo/front-view-blue-cool-lemonade-with-ice-blue-background-fruit-cold-cocktail-drink-color-bar-juice_140725-156766.jpg?t=st=1747286212~exp=1747289812~hmac=e1cfe71d7a31e2823b435c7d091d27531bfda7886621abd0fc0ef791efb26aab&w=826",
    category: "specialty",
    inStock: true
  },
  {
    id: "lemonade-lavender",
    name: "Lavender Lemonade",
    description: "A floral and delicate blend of lavender essence and our classic lemonade.",
    price: 5.49,
    imageUrl: "https://img.freepik.com/free-photo/butterfly-pea-juice-with-coconut-wooden-surface_1150-44420.jpg?t=st=1747286314~exp=1747289914~hmac=f5458a947f5c5f0ab0cf7c00cc0155a01eecdb5e60284a64b6d0d80a48c344e9&w=826",
    category: "premium",
    inStock: true
  },
  {
    id: "lemonade-ginger",
    name: "Ginger Lemonade",
    description: "A spicy kick of ginger combined with our tangy lemonade for a warming sensation.",
    price: 4.79,
    imageUrl: "https://img.freepik.com/free-photo/delicious-healthy-lemon-tea-concept_23-2148799194.jpg?t=st=1747286414~exp=1747290014~hmac=4993d992d7ddd3b85cc0ba976394289aeac2a309cef5b05e93068dbefed404e9&w=826",
    category: "specialty",
    inStock: true
  },
  {
    id: "lemonade-jaljeera",
    name: "Jaljeera Lemonade",
    description: "Indian-inspired with cumin, mint, and a blend of spices for a unique taste experience.",
    price: 5.29,
    imageUrl: "/jaljeera-lemonade.jpg",
    category: "premium",
    inStock: true
  },
  {
    id: "lemonade-cola",
    name: "Cola Lemonade",
    description: "The perfect fusion of cola flavors with our classic lemonade for a refreshing twist.",
    price: 4.79,
    imageUrl: "https://img.freepik.com/free-photo/glass-coca-cola-with-ice-cubes-lemon-slice-grey-background_140725-10691.jpg?t=st=1748513195~exp=1748516795~hmac=63715fd63a376aa53d991ef4e8944ab1e40d9e12fd12fff0c5806bcd12d12bea&w=1380",
    category: "specialty",
    inStock: true
  },
  {
    id: "lemonade-rose",
    name: "Rose Lemonade",
    description: "Delicately perfumed with rose water for a fragrant and exotic lemonade experience.",
    price: 5.49,
    imageUrl: "https://img.freepik.com/free-photo/cold-brew-hibiscus-tea-with-ice-basil-leaves_114579-29762.jpg?t=st=1748513496~exp=1748517096~hmac=c77e536f9e305c0df6d74a723298553c4b66b98dc5a8976184aea522bf65053b&w=1380",
    category: "premium",
    inStock: true
  }
];

// Try to load products from localStorage or use initial data
let loadedProducts: Product[];
try {
  const storedProducts = localStorage.getItem("products");
  if (storedProducts) {
    loadedProducts = JSON.parse(storedProducts);
  } else {
    loadedProducts = initialProducts;
    // Initialize localStorage with default products
    localStorage.setItem("products", JSON.stringify(initialProducts));
  }
} catch (error) {
  console.error("Error loading products from localStorage:", error);
  loadedProducts = initialProducts;
}

export const products: Product[] = loadedProducts;

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};
