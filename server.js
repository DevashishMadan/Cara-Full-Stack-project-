const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DB_PATH = path.join(__dirname, 'data', 'db.json');

function readDB() {
  try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); }
  catch { return { products: [], users: [], cart: [], orders: [], contacts: [], wishlist: [] }; }
}
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ---- PRODUCTS ----
app.get('/api/products', (req, res) => {
  const db = readDB();
  let products = db.products;
  const { category, search, minPrice, maxPrice, sort } = req.query;
  if (category && category !== 'All') products = products.filter(p => p.category === category);
  if (search) products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
  if (minPrice) products = products.filter(p => p.price >= Number(minPrice));
  if (maxPrice) products = products.filter(p => p.price <= Number(maxPrice));
  if (sort === 'price-asc') products.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') products.sort((a, b) => b.price - a.price);
  else if (sort === 'newest') products.sort((a, b) => b.id - a.id);
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const db = readDB();
  const p = db.products.find(p => p.id == req.params.id);
  p ? res.json(p) : res.status(404).json({ error: 'Not found' });
});

// ---- USERS ----
app.post('/api/signup', (req, res) => {
  const db = readDB();
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  if (db.users.find(u => u.email === email)) return res.status(409).json({ error: 'Email already registered' });
  const user = { id: Date.now(), name, email, password, createdAt: new Date().toISOString() };
  db.users.push(user);
  writeDB(db);
  res.json({ success: true, user: { id: user.id, name, email } });
});

app.post('/api/login', (req, res) => {
  const db = readDB();
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
});

app.post('/api/forgot-password', (req, res) => {
  const db = readDB();
  const { email } = req.body;
  const user = db.users.find(u => u.email === email);
  if (!user) return res.status(404).json({ error: 'Email not found' });
  res.json({ success: true, message: 'Reset link sent to ' + email });
});

// ---- CART ----
app.get('/api/cart/:userId', (req, res) => {
  const db = readDB();
  const cartItems = db.cart.filter(c => c.userId == req.params.userId);
  res.json(cartItems);
});

app.post('/api/cart', (req, res) => {
  const db = readDB();
  const { userId, productId, size, qty } = req.body;
  const existing = db.cart.find(c => c.userId == userId && c.productId == productId && c.size === size);
  if (existing) { existing.qty += qty || 1; }
  else { db.cart.push({ id: Date.now(), userId, productId, size, qty: qty || 1, addedAt: new Date().toISOString() }); }
  writeDB(db);
  res.json({ success: true });
});

app.delete('/api/cart/:id', (req, res) => {
  const db = readDB();
  db.cart = db.cart.filter(c => c.id != req.params.id);
  writeDB(db);
  res.json({ success: true });
});

app.put('/api/cart/:id', (req, res) => {
  const db = readDB();
  const item = db.cart.find(c => c.id == req.params.id);
  if (item) { item.qty = req.body.qty; if (item.qty <= 0) db.cart = db.cart.filter(c => c.id != req.params.id); }
  writeDB(db);
  res.json({ success: true });
});

// ---- WISHLIST ----
app.get('/api/wishlist/:userId', (req, res) => {
  const db = readDB();
  res.json(db.wishlist.filter(w => w.userId == req.params.userId));
});

app.post('/api/wishlist', (req, res) => {
  const db = readDB();
  const { userId, productId } = req.body;
  if (db.wishlist.find(w => w.userId == userId && w.productId == productId)) {
    db.wishlist = db.wishlist.filter(w => !(w.userId == userId && w.productId == productId));
    writeDB(db); return res.json({ action: 'removed' });
  }
  db.wishlist.push({ id: Date.now(), userId, productId });
  writeDB(db);
  res.json({ action: 'added' });
});

// ---- ORDERS ----
app.post('/api/orders', (req, res) => {
  const db = readDB();
  const { userId, items, total } = req.body;
  const order = { id: Date.now(), userId, items, total, status: 'confirmed', createdAt: new Date().toISOString() };
  db.orders.push(order);
  db.cart = db.cart.filter(c => c.userId != userId);
  writeDB(db);
  res.json({ success: true, orderId: order.id });
});

// ---- BLOG ----
app.get('/api/blog', (req, res) => {
  const db = readDB();
  res.json(db.blog || []);
});

// ---- CONTACT ----
app.post('/api/contact', (req, res) => {
  const db = readDB();
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Required fields missing' });
  db.contacts.push({ id: Date.now(), name, email, subject, message, receivedAt: new Date().toISOString() });
  writeDB(db);
  res.json({ success: true });
});

// Serve index for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`🌟 Cara server running at http://localhost:${PORT}`));
