
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
    content: `
      <h2>Welcome to Lemonade Luxury!</h2>
      <p>This guide will help you get started with our premium lemonade products.</p>
      <h3>How to Order</h3>
      <ol>
        <li>Browse our product selection</li>
        <li>Add items to your cart</li>
        <li>Proceed to checkout</li>
        <li>Enter your shipping and payment information</li>
        <li>Confirm your order</li>
      </ol>
      <p>Once your order is confirmed, you'll receive an email with your order details and tracking information.</p>
    `,
    updatedAt: "2023-09-15T10:30:00Z"
  },
  {
    id: "product-care",
    title: "Product Care",
    content: `
      <h2>Caring for Your Lemonade</h2>
      <p>To ensure the best taste and quality of our lemonade products, please follow these guidelines:</p>
      <ul>
        <li>Store all products in a refrigerator at 2-4°C (35-39°F)</li>
        <li>Consume within 7 days of opening</li>
        <li>Shake well before serving</li>
        <li>Serve chilled for best flavor</li>
      </ul>
      <h3>Serving Suggestions</h3>
      <p>Our lemonades pair perfectly with:</p>
      <ul>
        <li>Fresh mint leaves</li>
        <li>A slice of lemon or lime</li>
        <li>Ice cubes made from filtered water</li>
        <li>A splash of sparkling water for extra fizz</li>
      </ul>
    `,
    updatedAt: "2023-10-02T14:15:00Z"
  },
  {
    id: "mini-game-help",
    title: "Mini-Game Help",
    content: `
      <h2>Lemon Catcher Game Guide</h2>
      <p>Our Lemon Catcher mini-game is a fun way to earn discounts on our products!</p>
      <h3>How to Play</h3>
      <ol>
        <li>Use left and right arrow keys or swipe on mobile to control the basket</li>
        <li>Catch falling lemons to increase your score</li>
        <li>Avoid missing lemons</li>
        <li>Try to reach a high score!</li>
      </ol>
      <h3>Special Rewards</h3>
      <p>If you catch 100 lemons while missing 20 or fewer, you'll earn a 20% discount on Strawberry Lemonade!</p>
      <p>The discount will be automatically applied at checkout.</p>
    `,
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
