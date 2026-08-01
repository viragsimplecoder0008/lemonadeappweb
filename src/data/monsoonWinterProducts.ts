import { Product } from "@/types";

// Monsoon / Winter categories are namespaced: winter-monsoon-<classic|specialty|golden>
export const MONSOON_CATEGORIES = {
  classic: "winter-monsoon-classic",
  specialty: "winter-monsoon-specialty",
  golden: "winter-monsoon-golden",
} as const;

// Map legacy/global categories onto the namespaced monsoon ones
export const normalizeMonsoonCategory = (category?: string): string => {
  switch (category) {
    case "classic":
      return MONSOON_CATEGORIES.classic;
    case "specialty":
      return MONSOON_CATEGORIES.specialty;
    case "premium":
    case "golden":
      return MONSOON_CATEGORIES.golden;
    default:
      return category || MONSOON_CATEGORIES.classic;
  }
};

// Monsoon / Winter collection initial products (empty by default; managed via admin)
export const initialMonsoonWinterProducts: Product[] = [];


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

    loadedMonsoonWinterProducts = Array.from(uniqueMap.values()).map(p => ({
      ...p,
      category: normalizeMonsoonCategory(p.category),
    }));
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
  const target = normalizeMonsoonCategory(category);
  return allProds.filter((p) => normalizeMonsoonCategory(p.category) === target);
};
