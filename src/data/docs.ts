
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
    content: `<h2>Welcome to Lemonade Luxury!</h2>
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
<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
  <h4 class="font-semibold text-blue-800">Pro Tip:</h4>
  <p class="text-blue-700">Sign up for our VIP program to get exclusive discounts and early access to new flavors!</p>
</div>`,
    updatedAt: "2023-09-15T10:30:00Z"
  },
  {
    id: "product-care",
    title: "Product Care",
    content: `<h2>Caring for Your Lemonade</h2>
<p>To ensure the best taste and quality of our lemonade products, please follow these guidelines:</p>
<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
  <h3 class="font-semibold text-yellow-800">Storage Instructions</h3>
  <ul class="text-yellow-700 mt-2">
    <li>Store all products in a refrigerator at 2-4°C (35-39°F)</li>
    <li>Consume within 7 days of opening</li>
    <li>Shake well before serving</li>
    <li>Serve chilled for best flavor</li>
  </ul>
</div>
<h3>Serving Suggestions</h3>
<p>Our lemonades pair perfectly with:</p>
<ul class="list-disc pl-6 space-y-1">
  <li><strong>Fresh mint leaves</strong> - adds a refreshing twist</li>
  <li><strong>A slice of lemon or lime</strong> - enhances the citrus flavor</li>
  <li><strong>Ice cubes made from filtered water</strong> - keeps it cold without diluting</li>
  <li><strong>A splash of sparkling water</strong> - for extra fizz</li>
</ul>
<div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
  <p class="text-green-800"><em>Remember: Quality ingredients deserve quality care!</em></p>
</div>`,
    updatedAt: "2023-10-02T14:15:00Z"
  },
  {
    id: "mini-game-help",
    title: "Mini-Game Help",
    content: `<h2>Lemon Catcher Game Guide</h2>
<p>Our Lemon Catcher mini-game is a fun way to earn discounts on our products!</p>
<div class="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
  <h3 class="font-semibold text-purple-800">How to Play</h3>
  <ol class="text-purple-700 mt-2 space-y-1">
    <li>Use <kbd class="bg-gray-200 px-2 py-1 rounded text-sm">←</kbd> and <kbd class="bg-gray-200 px-2 py-1 rounded text-sm">→</kbd> arrow keys or swipe on mobile to control the basket</li>
    <li>Catch falling lemons to increase your score</li>
    <li>Avoid missing lemons - too many misses will end the game</li>
    <li>Try to reach a high score!</li>
  </ol>
</div>
<div class="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
  <h3 class="font-semibold text-orange-800">🎁 Special Rewards</h3>
  <p class="text-orange-700 mt-2">If you catch <strong>100 lemons</strong> while missing <strong>20 or fewer</strong>, you'll earn a <span class="font-bold text-green-600">20% discount</span> on Strawberry Lemonade!</p>
  <p class="text-orange-700 mt-1">The discount will be automatically applied at checkout.</p>
</div>
<hr class="my-4">
<h3>Game Controls</h3>
<table class="w-full border-collapse border border-gray-300">
  <thead>
    <tr class="bg-gray-100">
      <th class="border border-gray-300 p-2 text-left">Platform</th>
      <th class="border border-gray-300 p-2 text-left">Controls</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-300 p-2"><strong>Desktop</strong></td>
      <td class="border border-gray-300 p-2">Arrow keys (← →)</td>
    </tr>
    <tr>
      <td class="border border-gray-300 p-2"><strong>Mobile</strong></td>
      <td class="border border-gray-300 p-2">Swipe left/right or tap buttons</td>
    </tr>
  </tbody>
</table>`,
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
