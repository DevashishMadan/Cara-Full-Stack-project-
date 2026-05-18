# Cara — The Clothing Website

A full-stack fashion e-commerce website built with **Express.js** backend and a beautiful SPA frontend.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd cara
npm install
```

### 2. Start the Server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

### 3. Open in Browser
```
http://localhost:3000
```

---

## 🗂️ Project Structure

```
cara/
├── server.js              ← Express.js backend
├── package.json           ← Dependencies
├── data/
│   └── db.json            ← JSON database (products, users, orders, etc.)
├── public/
│   ├── index.html         ← Main SPA HTML
│   ├── css/
│   │   └── main.css       ← All styles
│   └── js/
│       └── app.js         ← Frontend JavaScript
```

---

## 🔌 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/products | Get all products (filter by ?category, ?search, ?sort) |
| GET | /api/products/:id | Get single product |
| POST | /api/signup | Create new user |
| POST | /api/login | Authenticate user |
| POST | /api/forgot-password | Request password reset |
| GET | /api/cart/:userId | Get user's cart |
| POST | /api/cart | Add item to cart |
| PUT | /api/cart/:id | Update cart item quantity |
| DELETE | /api/cart/:id | Remove cart item |
| GET | /api/wishlist/:userId | Get wishlist |
| POST | /api/wishlist | Toggle wishlist item |
| POST | /api/orders | Place an order |
| GET | /api/blog | Get all blog posts |
| POST | /api/contact | Submit contact form |

---

## ✨ Features

- 🏠 **Home** — Hero slideshow, categories, featured products, testimonials, newsletter
- 🛍️ **Shop** — 22+ products, filter by category/price/size/rating, sort options
- 📝 **Blog** — 6 articles with featured layout and category browsing
- ℹ️ **About** — Story, values, team, press mentions
- 📞 **Contact** — Contact form, FAQ accordion, social links
- 🔐 **Auth** — Login, Signup, Forgot Password pages
- 🛒 **Cart** — Slide-in drawer, qty controls, checkout
- ❤️ **Wishlist** — Save items for later
- 🤖 **AI Stylist** — Powered by Claude API
- 🔍 **Search** — Live search with dropdown results

---

## 🎨 Demo Login
Email: `demo@cara.com`
Password: `demo123`

---

Built with ♥ in Ludhiana, India.
