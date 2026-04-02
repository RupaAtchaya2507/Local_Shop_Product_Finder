# ShopEase — Frontend

React + Vite client for the ShopEase local shop product finder platform.

---

## Stack

- React 19
- Vite 7
- React Router DOM v7
- Axios
- Leaflet.js + React-Leaflet (maps)
- OSRM API (route drawing)

---

## Getting Started

```bash
npm install
npm run dev
```

Runs on **http://localhost:5173**

Requires the backend to be running on **http://localhost:5000**

---

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page |
| `/login` | Login | User login |
| `/signup` | Signup | Register as customer or shop owner |
| `/customer` | CustomerDashboard | Product search, map, filters, wishlist |
| `/shop` | ShopDashboard | Shop registration and product management |
| `/shop-detail/:shopId` | ShopDetail | Shop profile, products, reviews, chat |
| `/wishlist` | Wishlist | Saved products |

---

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

---

## Notes

- User session (`user_id`, `user_type`, `name`) is stored in `localStorage` after login
- Map uses OpenStreetMap tiles (no API key required)
- Routing uses the public OSRM API (`router.project-osrm.org`)
