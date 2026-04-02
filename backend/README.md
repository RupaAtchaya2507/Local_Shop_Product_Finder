# ShopEase — Backend

Express.js REST API with SQLite database for the ShopEase platform.

---

## Stack

- Node.js + Express.js
- SQLite via better-sqlite3
- JWT authentication (jsonwebtoken)
- Password hashing (bcryptjs)

---

## Getting Started

```bash
npm install
node server.js
```

Runs on **http://localhost:5000**

The SQLite database (`local_shop_finder.db`) is created automatically on first run.

---

## Project Structure

```
backend/
├── routes/
│   ├── auth.js       # Signup, login
│   ├── shop.js       # Shop and product management
│   ├── customer.js   # Product search, recommendations, price stats
│   ├── ratings.js    # Shop ratings and reviews
│   └── messages.js   # Customer-shop messaging
├── db.js             # SQLite connection and schema setup
├── server.js         # Express app entry point, wishlist routes
└── seed.js           # Optional database seeding
```

---

## Database Tables

| Table | Description |
|-------|-------------|
| `users` | Registered users (customers and shop owners) |
| `shops` | Shop details with GPS coordinates |
| `products` | Products linked to shops |
| `wishlist` | User saved products |
| `ratings` | Star ratings and reviews for shops |
| `messages` | Chat messages between customers and shops |

---

## Environment Variables

Create a `.env` file in this directory:

```env
JWT_SECRET=your_secret_here
PORT=5000
```

> The current code uses a hardcoded JWT secret. Update `routes/auth.js` to use `process.env.JWT_SECRET` before deploying.

---

## API Routes

### Auth — `/api/auth`
| Method | Path | Description |
|--------|------|-------------|
| POST | `/signup` | Register new user |
| POST | `/login` | Login, returns JWT + user info |

### Shop — `/api/shop`
| Method | Path | Description |
|--------|------|-------------|
| POST | `/add` | Register shop with optional products |
| GET | `/my-shop` | Get shop by owner ID |
| GET | `/:id` | Get shop with products and ratings |
| PUT | `/update-stock` | Update product stock |
| PUT | `/update-product` | Update product details |
| POST | `/add-product` | Add product to existing shop |
| DELETE | `/delete-product/:id` | Delete a product |

### Customer — `/api/customer`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/search` | Search products by name + location |
| GET | `/suggest` | Autocomplete product names |
| GET | `/price-stats` | Avg and min price per product |
| GET | `/recommendations` | Category + co-wishlist recommendations |
| GET | `/categories` | All distinct product categories |

### Wishlist — `/api/wishlist`
| Method | Path | Description |
|--------|------|-------------|
| POST | `/add` | Add product to wishlist |
| GET | `/:user_id` | Get user's wishlist |
| DELETE | `/remove/:id` | Remove wishlist item |

### Ratings — `/api/ratings`
| Method | Path | Description |
|--------|------|-------------|
| POST | `/shop/:shop_id` | Submit or update rating |
| GET | `/shop/:shop_id` | Get all ratings for a shop |

### Messages — `/api/messages`
| Method | Path | Description |
|--------|------|-------------|
| POST | `/send` | Send a message |
| GET | `/conversation` | Get messages for a user+shop pair |
| GET | `/shop/:shop_id` | Get all conversations for a shop |
