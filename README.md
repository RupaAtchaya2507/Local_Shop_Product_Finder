# ShopEase — Local Shop Product Finder

ShopEase is a full-stack hyperlocal commerce platform that connects customers with nearby local shops. Customers can search for products, compare prices, check live stock, save wishlists, rate shops, and chat with shop owners — all in one place.

---

## Project Structure

```
Localshop_product_finder/
├── backend/          # Express.js REST API + SQLite database
└── frontend/         # React + Vite client application
```

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 19, Vite, React Router DOM v7     |
| Maps       | Leaflet.js, React-Leaflet, OSRM API     |
| HTTP       | Axios                                   |
| Backend    | Node.js, Express.js                     |
| Database   | SQLite (better-sqlite3)                 |
| Auth       | JWT (jsonwebtoken), bcryptjs            |

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm

### 1. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Run the backend

```bash
cd backend
node server.js
```

Server starts on **http://localhost:5000**

### 3. Run the frontend

```bash
cd frontend
npm run dev
```

App opens on **http://localhost:5173**

---

## Features

### Customer
- GPS-based product search (within 100 km)
- Filter by distance, price, and rating
- Sort by distance, price, or rating
- List view and interactive map view with route drawing
- Wishlist (add/remove products)
- Price badges (Best Price / Avg Price / Pricey)
- Product recommendations
- Autocomplete search suggestions
- Real-time chat with shop owners
- Shop detail page with products, reviews, and chat

### Shop Owner
- Register shop with GPS location
- Add, edit, and delete products
- Live stock management
- View and reply to customer messages

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/shop/add` | Register shop |
| GET | `/api/shop/my-shop` | Get owner's shop |
| GET | `/api/shop/:id` | Get shop by ID |
| PUT | `/api/shop/update-stock` | Update product stock |
| POST | `/api/shop/add-product` | Add product to shop |
| DELETE | `/api/shop/delete-product/:id` | Delete product |
| GET | `/api/customer/search` | Search products by location |
| GET | `/api/customer/suggest` | Autocomplete suggestions |
| GET | `/api/customer/price-stats` | Price averages per product |
| GET | `/api/customer/recommendations` | Recommended products |
| POST | `/api/wishlist/add` | Add to wishlist |
| GET | `/api/wishlist/:user_id` | Get wishlist |
| DELETE | `/api/wishlist/remove/:id` | Remove from wishlist |
| POST | `/api/ratings/shop/:shop_id` | Submit rating |
| GET | `/api/ratings/shop/:shop_id` | Get shop ratings |
| POST | `/api/messages/send` | Send message |
| GET | `/api/messages/conversation` | Get conversation |
| GET | `/api/messages/shop/:shop_id` | Get all shop conversations |

---

## Environment Notes

- The SQLite database file (`backend/local_shop_finder.db`) is excluded from version control via `.gitignore`
- The JWT secret is currently hardcoded — move it to a `.env` file before deploying to production

```env
JWT_SECRET=your_secret_here
PORT=5000
```

---

## User Roles

| Role | Access |
|------|--------|
| Customer | Search, wishlist, ratings, chat with shops |
| Shop Owner | Register shop, manage products, reply to messages |

Role is selected at signup and encoded in the JWT token.
