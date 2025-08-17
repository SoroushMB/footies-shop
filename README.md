# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

---

## Backend Generation Prompt for LLM

Below is a detailed prompt you can use to instruct another LLM to generate the backend for this project.

### Prompt:

You are an expert backend developer. Your task is to design and generate the complete backend code for an e-commerce application called **"Apex Football Gear"**. The frontend is already built using Next.js and React.

**1. Technology Stack:**

*   **Framework:** Node.js with Express.js
*   **Database:** Firebase Firestore (for product data, user profiles, and orders)
*   **Authentication:** Firebase Authentication (integrate with the existing user accounts)
*   **Programming Language:** TypeScript
*   **Environment Variables:** Use a `.env` file for configuration (e.g., Firebase credentials, database URLs, secret keys).

**2. Core Backend Features & API Endpoints:**

Please generate the code for the following features, including API routes, controllers/services, and data models. Ensure all API endpoints handle request validation, error handling, and appropriate HTTP status codes.

**a. Product Management API (`/api/products`)**

*   `GET /api/products`: Fetch all products. Implement filtering by category (`?category=jerseys`), brand (`?brand=Nike`), and sorting (e.g., `?sortBy=price_asc`).
*   `GET /api/products/:id`: Fetch a single product by its ID.
*   `GET /api/products/featured`: Fetch all products where `isFeatured` is true.
*   `GET /api/products/popular`: Fetch all products where `isPopular` is true.

**b. Category Management API (`/api/categories`)**

*   `GET /api/categories`: Fetch all product categories.
*   `GET /api/categories/:slug`: Fetch a single category by its slug.

**c. User Authentication & Profile API (`/api/auth`)**

*   **Login/Signup:** The frontend handles this via the Firebase client-side SDK. The backend needs to be ableto verify Firebase ID tokens sent from the client. Create middleware to protect routes by verifying these tokens.
*   `GET /api/users/me`: A protected route that retrieves the profile of the currently authenticated user from Firestore.
*   `PUT /api/users/me`: A protected route to update the authenticated user's profile information.

**d. Shopping Cart API (`/api/cart`)**

*   These endpoints must be protected and operate on the authenticated user's cart.
*   `GET /api/cart`: Get the contents of the user's cart.
*   `POST /api/cart`: Add a product to the cart. Expects `{ productId: string, quantity: number }`.
*   `PUT /api/cart/:productId`: Update the quantity of a product in the cart. Expects `{ quantity: number }`.
*   `DELETE /api/cart/:productId`: Remove a product from the cart.

**e. Order & Checkout API (`/api/checkout`)**

*   `POST /api/checkout`: A protected endpoint to handle the entire checkout process.
    *   It should receive the user's cart contents and shipping information.
    *   **Crucially, for now, simulate the payment processing part.** Do not implement a real payment gateway integration.
    *   On successful "payment", it should create a new order document in Firestore, associate it with the user, and clear the user's shopping cart.

**f. AI Product Suggestion API (`/api/ai/suggestions`)**

*   `POST /api/ai/suggestions`: A protected endpoint that receives `{ currentProductId: string, userProfile: object }`.
*   This endpoint should call a generative AI model (like Google's Gemini) with a prompt to suggest related products.
*   The prompt should be structured like this: "You are an expert e-commerce assistant for a football gear store. A user is viewing '[Product Name]'. Based on this and their profile, suggest 3 related products and provide a brief reason."
*   The endpoint should return the AI's suggestions and reasoning in a JSON format: `{ "suggestions": [...], "reasoning": "..." }`.

**3. Database Schema (Firestore Collections):**

Please define the data structures for the following collections:

*   **`products`**: `id`, `name`, `description`, `price`, `category` (string), `brand`, `sizes` (array), `images` (array of URLs), `isFeatured` (boolean), `isPopular` (boolean).
*   **`categories`**: `id`, `name`, `slug`.
*   **`users`**: `uid` (Firebase Auth UID), `email`, `name`, `shippingAddress`, etc.
*   **`carts`**: Each document ID should be the user's `uid`. Contains a subcollection or array of `cartItems` with `productId`, `quantity`, `price`.
*   **`orders`**: `orderId`, `userId`, `items` (array of products), `totalAmount`, `shippingAddress`, `orderDate`, `status` (e.g., 'pending', 'shipped').

**4. Project Structure:**

Please organize the generated code into a logical directory structure. For example:

```
/
├── src/
│   ├── api/                // Express routes
│   │   ├── products.ts
│   │   ├── auth.ts
│   │   └── ...
│   ├── controllers/        // Business logic
│   │   ├── productController.ts
│   │   └── ...
│   ├── models/             // Data interfaces/types
│   │   ├── Product.ts
│   │   └── ...
│   ├── services/           // External service integrations (Firebase, GenAI)
│   │   └── firebase.ts
│   ├── middleware/
│   │   └── authMiddleware.ts // Middleware to verify Firebase tokens
│   ├── config/
│   │   └── index.ts
│   └── app.ts              // Main Express app setup
├── .env
└── package.json
```

Please provide the complete code for all the files mentioned above.
