
interface Doc {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

const docs: Doc[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    content: `## Welcome to Lemonade.

This guide will help you get started with our premium lemonade products.

### How to Order

- Browse our product selection
- Add items to your cart
- Proceed to checkout
- Enter your shipping and payment information
- Confirm your order

Once your order is confirmed, you'll receive an email with your order details and tracking information.

^^Header="Pro Tip",Content="Sign up for our VIP program to get exclusive discounts and early access to new flavors!",Color="blue"^^`,
    updatedAt: "2023-09-15T10:30:00Z"
  },
  {
    id: "product-care",
    title: "Product Care",
    content: `## Caring for Your Lemonade

To ensure the best taste and quality of our lemonade products, please follow these guidelines:

^^Header="Storage Instructions",Content="Store products at 2-4°C. Consume within 7 days of opening. Shake well and serve chilled.",Color="yellow"^^

### Serving Suggestions

Our lemonades pair perfectly with:

- **Fresh mint leaves** - adds a refreshing twist
- **A slice of lemon or lime** - enhances the citrus flavor
- **Ice cubes made from filtered water** - keeps it cold without diluting
- **A splash of sparkling water** - for extra fizz

^^Header="Remember",Content="Quality ingredients deserve quality care!",Color="green"^^`,
    updatedAt: "2023-10-02T14:15:00Z"
  },
  {
    id: "mini-game-help",
    title: "Mini-Game Help",
    content: `## Lemon Catcher Game Guide

Our Lemon Catcher mini-game is a fun way to earn discounts on our products!

^^Header="How to Play",Content="Use arrow keys or swipe on mobile to move the basket. Catch lemons, avoid missing too many, and rack up your score!",Color="purple"^^

^^Header="Special Rewards",Content="Catch 100 lemons while missing 20 or fewer to earn a !coloredText.\\"20% discount\\".green on Strawberry Lemonade! Applied automatically at checkout.",Color="orange"^^

---

### Game Controls

TABLE: Platform | Controls
 Desktop: Arrow keys (\u2190 \u2192)
 Mobile: Swipe left/right or tap buttons`,
    updatedAt: "2023-11-10T09:45:00Z"
  }
];

// Get all docs
export const getAllDocs = (): Doc[] => {
  // In a real app, this would fetch from a database
  return docs;
};

// Get a specific doc by ID
export const getDocById = (id: string): Doc | undefined => {
  return docs.find(doc => doc.id === id);
};

// Update a doc (for admin editing)
export const updateDoc = (id: string, updates: Partial<Doc>): void => {
  const docIndex = docs.findIndex(doc => doc.id === id);
  if (docIndex !== -1) {
    docs[docIndex] = {
      ...docs[docIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    // In a real app, this would save to a database
    console.log("Document updated:", docs[docIndex]);
  }
};

// Create a new doc
export const createDoc = (doc: Doc): void => {
  docs.push(doc);
  // In a real app, this would save to a database
  console.log("Document created:", doc);
};

// Delete a doc
export const deleteDoc = (id: string): void => {
  const docIndex = docs.findIndex(doc => doc.id === id);
  if (docIndex !== -1) {
    const deletedDoc = docs.splice(docIndex, 1)[0];
    // In a real app, this would delete from a database
    console.log("Document deleted:", deletedDoc);
  }
};
