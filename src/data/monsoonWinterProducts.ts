import { Product } from "@/types";

// Monsoon / Winter collection initial products
export const initialMonsoonWinterProducts: Product[] = [
  {
    id: "Hot-Chocolate",
    name: "Hot Chocolate",
    description: "Rich, velvety cocoa blended with warm milk and topped with fluffy marshmallows. Perfect for cozy monsoon showers and winter evenings.",
    price: 5.49,
    imageUrl: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&auto=format&fit=crop&q=80",
    category: "specialty",
    inStock: true
  }
];

// Load products from localStorage or default dataset, ensuring Hot Chocolate is always included
let loadedMonsoonWinterProducts: Product[];
try {
  const stored = localStorage.getItem("monsoon_winter_products");
  if (stored) {
    const parsed: Product[] = JSON.parse(stored);
    // Ensure initial default products are present if not explicitly deleted
    const existingIds = new Set(parsed.map((p) => p.id));
    initialMonsoonWinterProducts.forEach((initProd) => {
      if (!existingIds.has(initProd.id) && !existingIds.has(initProd.name.trim().replace(/\s+/g, "-"))) {
        parsed.unshift(initProd);
      }
    });
    loadedMonsoonWinterProducts = parsed;
    localStorage.setItem("monsoon_winter_products", JSON.stringify(loadedMonsoonWinterProducts));
  } else {
    loadedMonsoonWinterProducts = initialMonsoonWinterProducts;
    localStorage.setItem("monsoon_winter_products", JSON.stringify(initialMonsoonWinterProducts));
  }
} catch {
  loadedMonsoonWinterProducts = initialMonsoonWinterProducts;
}

export const monsoonWinterProducts: Product[] = loadedMonsoonWinterProducts;

export const getMonsoonWinterProductById = (id: string): Product | undefined => {
  let allProds = [...monsoonWinterProducts];
  try {
    const stored = localStorage.getItem("monsoon_winter_products");
    if (stored) allProds = JSON.parse(stored);
  } catch {
    /* ignore */
  }
  const cleanId = id.trim().toLowerCase();
  return allProds.find(
    (p) =>
      p &&
      (p.id.toLowerCase() === cleanId ||
        p.name.trim().replace(/\s+/g, "-").toLowerCase() === cleanId)
  );
};

export const getMonsoonWinterProductsByCategory = (category: string): Product[] => {
  let allProds = [...monsoonWinterProducts];
  try {
    const stored = localStorage.getItem("monsoon_winter_products");
    if (stored) allProds = JSON.parse(stored);
  } catch {
    /* ignore */
  }
  if (category === "all") return allProds;
  return allProds.filter((p) => p.category === category);
};
