import { Product } from "@/types";

// Monsoon / Winter collection initial products
export const initialMonsoonWinterProducts: Product[] = [
  {
    id: "Hot-Chocolate",
    name: "Hot Chocolate",
    description: "Taste our irresistible Hot Chocolate, infused with rich cocoa and a touch of warmth.",
    price: 13.99,
    imageUrl: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&auto=format&fit=crop&q=80",
    category: "specialty",
    inStock: true
  }
];

// Load products from localStorage or default dataset, purging any old duplicate Hot Chocolate
let loadedMonsoonWinterProducts: Product[];
try {
  const stored = localStorage.getItem("monsoon_winter_products");
  if (stored) {
    let parsed: Product[] = JSON.parse(stored);

    // Filter out the old duplicate "Rich, velvety cocoa..." version
    parsed = parsed.filter(p => !p.description.includes("Rich, velvety cocoa"));

    // Check if the "Taste our irresistible" Hot Chocolate is present
    const hasTargetProduct = parsed.some(p => p.description.includes("Taste our irresistible") || p.price === 13.99);

    if (!hasTargetProduct) {
      parsed.unshift(initialMonsoonWinterProducts[0]);
    }

    // Deduplicate array by product name / ID
    const uniqueMap = new Map<string, Product>();
    parsed.forEach(p => {
      const key = p.name ? p.name.trim().toLowerCase() : p.id.toLowerCase();
      if (!uniqueMap.has(key) || p.description.includes("Taste our irresistible") || p.price === 13.99) {
        uniqueMap.set(key, p);
      }
    });

    loadedMonsoonWinterProducts = Array.from(uniqueMap.values());
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
    if (stored) {
      const parsed: Product[] = JSON.parse(stored);
      allProds = parsed.filter(p => !p.description.includes("Rich, velvety cocoa"));
    }
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
    if (stored) {
      const parsed: Product[] = JSON.parse(stored);
      allProds = parsed.filter(p => !p.description.includes("Rich, velvety cocoa"));
    }
  } catch {
    /* ignore */
  }
  if (category === "all") return allProds;
  return allProds.filter((p) => p.category === category);
};
