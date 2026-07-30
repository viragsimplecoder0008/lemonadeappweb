import { Product } from "@/types";

// Monsoon / Winter collection products
// Add your Monsoon and Winter products to this array
export const initialMonsoonWinterProducts: Product[] = [
  // Example format for adding products:
  // {
  //   id: "spiced-warm-lemonade",
  //   name: "Spiced Warm Lemonade",
  //   description: "Infused with cinnamon, clove, and honey for chilly monsoon & winter days.",
  //   price: 5.99,
  //   category: "specialty",
  //   inStock: true
  // }
];

// Try to load products from localStorage or use initial data
let loadedMonsoonWinterProducts: Product[];
try {
  const stored = localStorage.getItem("monsoon_winter_products");
  if (stored) {
    loadedMonsoonWinterProducts = JSON.parse(stored);
  } else {
    loadedMonsoonWinterProducts = initialMonsoonWinterProducts;
    localStorage.setItem("monsoon_winter_products", JSON.stringify(initialMonsoonWinterProducts));
  }
} catch {
  loadedMonsoonWinterProducts = initialMonsoonWinterProducts;
}

export const monsoonWinterProducts: Product[] = loadedMonsoonWinterProducts;

export const getMonsoonWinterProductById = (id: string): Product | undefined => {
  return monsoonWinterProducts.find((p) => p.id === id);
};

export const getMonsoonWinterProductsByCategory = (category: string): Product[] => {
  return monsoonWinterProducts.filter((p) => p.category === category);
};
