const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const db = new Database("local_shop_finder.db");

console.log("Seeding database...");

db.exec(`
  DELETE FROM messages;
  DELETE FROM ratings;
  DELETE FROM wishlist;
  DELETE FROM products;
  DELETE FROM shops;
  DELETE FROM users;
`);

const password = bcrypt.hashSync("password123", 10);

// ── CUSTOMERS ──
const c1 = db.prepare("INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)").run("Rupa",    "rupa@gmail.com",    password, "customer");
const c2 = db.prepare("INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)").run("Arjun",   "arjun@gmail.com",   password, "customer");
const c3 = db.prepare("INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)").run("Meena",   "meena@gmail.com",   password, "customer");
const c4 = db.prepare("INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)").run("Karthik", "karthik@gmail.com", password, "customer");

// ── SHOP OWNERS ──
const o1  = db.prepare("INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)").run("Ramesh",   "ramesh@gmail.com",   password, "shop_owner");
const o2  = db.prepare("INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)").run("Priya",    "priya@gmail.com",    password, "shop_owner");
const o3  = db.prepare("INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)").run("Suresh",   "suresh@gmail.com",   password, "shop_owner");
const o4  = db.prepare("INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)").run("Kavitha",  "kavitha@gmail.com",  password, "shop_owner");
const o5  = db.prepare("INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)").run("Vijay",    "vijay@gmail.com",    password, "shop_owner");
const o6  = db.prepare("INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)").run("Lakshmi",  "lakshmi@gmail.com",  password, "shop_owner");
const o7  = db.prepare("INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)").run("Murugan",  "murugan@gmail.com",  password, "shop_owner");
const o8  = db.prepare("INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)").run("Deepa",    "deepa@gmail.com",    password, "shop_owner");
const o9  = db.prepare("INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)").run("Senthil",  "senthil@gmail.com",  password, "shop_owner");
const o10 = db.prepare("INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)").run("Anitha",   "anitha@gmail.com",   password, "shop_owner");

// ── SHOPS (spread around Chennai 13.26, 80.02) ──
// To use your own location: change BASE_LAT and BASE_LNG below
const BASE_LAT = 13.0895;
const BASE_LNG = 80.2739;

// Helper to offset coordinates by km
function offset(lat, lng, dLatKm, dLngKm) {
  return [
    lat + (dLatKm / 111),
    lng + (dLngKm / (111 * Math.cos(lat * Math.PI / 180)))
  ];
}

const addShop = db.prepare("INSERT INTO shops (owner_id, name, address, phone, lat, lng, rating) VALUES (?, ?, ?, ?, ?, ?, ?)");

// Shops placed 0.5 to 8 km from base location in different directions
const [lat1,  lng1]  = offset(BASE_LAT, BASE_LNG,  0.5,  0.3);
const [lat2,  lng2]  = offset(BASE_LAT, BASE_LNG, -0.8,  1.2);
const [lat3,  lng3]  = offset(BASE_LAT, BASE_LNG,  1.5, -0.5);
const [lat4,  lng4]  = offset(BASE_LAT, BASE_LNG, -1.2, -1.8);
const [lat5,  lng5]  = offset(BASE_LAT, BASE_LNG,  2.5,  2.0);
const [lat6,  lng6]  = offset(BASE_LAT, BASE_LNG, -2.0,  0.8);
const [lat7,  lng7]  = offset(BASE_LAT, BASE_LNG,  3.0, -2.5);
const [lat8,  lng8]  = offset(BASE_LAT, BASE_LNG, -3.5, -1.0);
const [lat9,  lng9]  = offset(BASE_LAT, BASE_LNG,  0.2,  4.0);
const [lat10, lng10] = offset(BASE_LAT, BASE_LNG,  4.5,  1.5);

const s1  = addShop.run(o1.lastInsertRowid,  "Ramesh General Store",       "Near Bus Stop, Vengal Village, Tiruvallur",        "9876543210", lat1,  lng1,  4.5).lastInsertRowid;
const s2  = addShop.run(o2.lastInsertRowid,  "Priya Electronics Hub",      "Main Road, Thiruninravur, Tiruvallur",             "9876543211", lat2,  lng2,  4.2).lastInsertRowid;
const s3  = addShop.run(o3.lastInsertRowid,  "Suresh Medical Store",       "Korattur Road, Periyapalayam, Tiruvallur",         "9876543212", lat3,  lng3,  4.8).lastInsertRowid;
const s4  = addShop.run(o4.lastInsertRowid,  "Kavitha Supermarket",        "Market Street, Poonamallee, Tiruvallur",           "9876543213", lat4,  lng4,  4.3).lastInsertRowid;
const s5  = addShop.run(o5.lastInsertRowid,  "Vijay Mobile World",         "Gandhi Road, Tiruvallur Town",                     "9876543214", lat5,  lng5,  4.6).lastInsertRowid;
const s6  = addShop.run(o6.lastInsertRowid,  "Lakshmi Bakery & Sweets",    "Temple Street, Thiruvalangadu, Tiruvallur",        "9876543215", lat6,  lng6,  4.7).lastInsertRowid;
const s7  = addShop.run(o7.lastInsertRowid,  "Murugan Pharmacy",           "NH 716, Minjur, Tiruvallur",                       "9876543216", lat7,  lng7,  4.4).lastInsertRowid;
const s8  = addShop.run(o8.lastInsertRowid,  "Deepa Fashion Store",        "Anna Nagar, Tiruvallur",                           "9876543217", lat8,  lng8,  4.1).lastInsertRowid;
const s9  = addShop.run(o9.lastInsertRowid,  "Senthil Stationery World",   "College Road, Vengal, Tiruvallur",                 "9876543218", lat9,  lng9,  4.5).lastInsertRowid;
const s10 = addShop.run(o10.lastInsertRowid, "Anitha Organic Store",       "Panchayat Road, Kadambathur, Tiruvallur",          "9876543219", lat10, lng10, 4.9).lastInsertRowid;

const IMG = {
  // Stationery
  "Pen":               "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&q=80",
  "Pencil":            "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&q=80",
  "Notebook":          "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&q=80",
  "Eraser":            "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400&q=80",
  "Ruler":             "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80",
  "Stapler":           "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&q=80",
  "Sketch Pens":       "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80",
  "Highlighter":       "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=400&q=80",
  "Sticky Notes":      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80",
  "Scissors":          "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&q=80",
  "Glue Stick":        "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&q=80",
  "Geometry Box":      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&q=80",
  "Drawing Book":      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80",
  "Marker Pens":       "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80",
  "File Folder":       "https://images.unsplash.com/photo-1568667256549-094345857637?w=400&q=80",
  "Tape":              "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&q=80",
  "Correction Pen":    "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&q=80",
  // Grocery
  "Rice 1kg":          "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80",
  "Organic Rice 1kg":  "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80",
  "Sugar 1kg":         "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&q=80",
  "Bread":             "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
  "Milk 500ml":        "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80",
  "Butter 100g":       "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80",
  "Eggs (6 pack)":     "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80",
  "Wheat Flour 1kg":   "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80",
  "Cooking Oil 1L":    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80",
  "Salt 1kg":          "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400&q=80",
  "Turmeric Powder":   "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80",
  "Chilli Powder":     "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80",
  "Coriander Powder":  "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80",
  "Tea Powder 250g":   "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
  "Coffee Powder":     "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80",
  "Soap":              "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&q=80",
  "Shampoo 200ml":     "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=400&q=80",
  "Toothpaste":        "https://images.unsplash.com/photo-1559591937-abc8a8b8e6b7?w=400&q=80",
  "Detergent 500g":    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80",
  "Organic Dal 500g":  "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80",
  "Honey 250g":        "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80",
  "Coconut Oil 500ml": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80",
  "Turmeric Milk Mix": "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80",
  "Green Tea":         "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
  "Herbal Shampoo":    "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=400&q=80",
  "Organic Soap":      "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&q=80",
  "Flaxseeds 250g":    "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=400&q=80",
  "Chia Seeds 200g":   "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=400&q=80",
  // Electronics
  "Mobile Phone":      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80",
  "Smartphone":        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80",
  "Tablet":            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80",
  "Earphones":         "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
  "TWS Earbuds":       "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80",
  "USB Cable":         "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  "USB-C Cable":       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  "Phone Cover":       "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=80",
  "Power Bank":        "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80",
  "Power Bank 20000mAh":"https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80",
  "Pen Drive 16GB":    "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&q=80",
  "Memory Card 32GB":  "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&q=80",
  "Bluetooth Speaker": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",
  "Laptop Bag":        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
  "Mouse":             "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80",
  "Keyboard":          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80",
  "HDMI Cable":        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  "Webcam":            "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&q=80",
  "Charger 20W":       "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80",
  "Screen Guard":      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=80",
  "Smart Watch":       "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
  // Medicine
  "Paracetamol":       "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
  "Ibuprofen":         "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
  "Vitamin C Tablets": "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&q=80",
  "Vitamin D3":        "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&q=80",
  "Multivitamin":      "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&q=80",
  "Calcium Tablets":   "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&q=80",
  "Iron Tablets":      "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&q=80",
  "Hand Sanitizer":    "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400&q=80",
  "Face Mask":         "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400&q=80",
  "Bandage":           "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&q=80",
  "Band Aid":          "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&q=80",
  "Cough Syrup":       "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80",
  "Cough Drops":       "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80",
  "Antacid Tablets":   "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
  "Eye Drops":         "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80",
  "Thermometer":       "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
  "BP Monitor":        "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80",
  "Glucose Strips":    "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80",
  "Antiseptic Cream":  "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80",
  "Nasal Spray":       "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80",
  "Pulse Oximeter":    "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80",
  "Glucometer":        "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80",
  "Aloe Vera Gel":     "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&q=80",
  "Neem Powder":       "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80",
  "Moringa Powder":    "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80",
  // Food
  "Biscuits":          "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80",
  "Chips":             "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80",
  "Instant Noodles":   "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80",
  "Chocolate":         "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&q=80",
  "Juice 1L":          "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80",
  "White Bread":       "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
  "Brown Bread":       "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
  "Croissant":         "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80",
  "Cake Slice":        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",
  "Muffin":            "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&q=80",
  "Cookies (6 pack)":  "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80",
  "Puff Pastry":       "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80",
  "Gulab Jamun":       "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
  "Ladoo (250g)":      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
  "Halwa":             "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
  // Clothing
  "T-Shirt":           "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
  "Jeans":             "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80",
  "Kurti":             "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&q=80",
  "Saree":             "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&q=80",
  "Formal Shirt":      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&q=80",
  "Trousers":          "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80",
  "Dupatta":           "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&q=80",
  "Leggings":          "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=80",
  "Socks (3 pack)":    "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&q=80",
  "Belt":              "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
  "Handbag":           "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
  "Wallet":            "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80",
};

const img = (name) => IMG[name] || "";

const p = db.prepare("INSERT INTO products (shop_id, product_name, category, price, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)");

// ── SHOP 1 — General Store ──
p.run(s1, "Pen",               "Stationery", 10,   200, img("Pen"));
p.run(s1, "Pencil",            "Stationery", 5,    300, "");
p.run(s1, "Notebook",          "Stationery", 45,   100, "");
p.run(s1, "Eraser",            "Stationery", 5,    400, "");
p.run(s1, "Ruler",             "Stationery", 15,   150, "");
p.run(s1, "Stapler",           "Stationery", 120,  60,  "");
p.run(s1, "Rice 1kg",          "Grocery",    60,   150, "");
p.run(s1, "Sugar 1kg",         "Grocery",    45,   120, "");
p.run(s1, "Bread",             "Grocery",    35,   80,  "");
p.run(s1, "Milk 500ml",        "Grocery",    25,   200, "");
p.run(s1, "Butter 100g",       "Grocery",    55,   90,  "");
p.run(s1, "Eggs (6 pack)",     "Grocery",    60,   100, "");
p.run(s1, "Biscuits",          "Food",       20,   250, "");
p.run(s1, "Chips",             "Food",       30,   180, "");
p.run(s1, "Instant Noodles",   "Food",       15,   300, "");

// ── SHOP 2 — Electronics Hub ──
p.run(s2, "Mobile Phone",      "Electronics", 8999,  20,  "");
p.run(s2, "Earphones",         "Electronics", 299,   50,  "");
p.run(s2, "USB Cable",         "Electronics", 99,    100, "");
p.run(s2, "Phone Cover",       "Electronics", 149,   80,  "");
p.run(s2, "Power Bank",        "Electronics", 999,   30,  "");
p.run(s2, "Pen Drive 16GB",    "Electronics", 349,   60,  "");
p.run(s2, "Bluetooth Speaker", "Electronics", 1299,  25,  "");
p.run(s2, "Laptop Bag",        "Electronics", 799,   40,  "");
p.run(s2, "Mouse",             "Electronics", 449,   55,  "");
p.run(s2, "Keyboard",          "Electronics", 699,   35,  "");
p.run(s2, "HDMI Cable",        "Electronics", 199,   70,  "");
p.run(s2, "Webcam",            "Electronics", 1499,  15,  "");

// ── SHOP 3 — Medical Store ──
p.run(s3, "Paracetamol",       "Medicine", 15,  500, "");
p.run(s3, "Vitamin C Tablets", "Medicine", 120, 200, "");
p.run(s3, "Hand Sanitizer",    "Medicine", 85,  150, "");
p.run(s3, "Face Mask",         "Medicine", 50,  300, "");
p.run(s3, "Bandage",           "Medicine", 30,  200, "");
p.run(s3, "Cough Syrup",       "Medicine", 95,  120, "");
p.run(s3, "Antacid Tablets",   "Medicine", 45,  180, "");
p.run(s3, "Eye Drops",         "Medicine", 75,  100, "");
p.run(s3, "Thermometer",       "Medicine", 250, 60,  "");
p.run(s3, "BP Monitor",        "Medicine", 1800,15,  "");
p.run(s3, "Glucose Strips",    "Medicine", 350, 40,  "");
p.run(s3, "Pen",               "Stationery", 12, 50, "");

// ── SHOP 4 — Supermarket ──
p.run(s4, "Wheat Flour 1kg",   "Grocery",  55,  200, "");
p.run(s4, "Cooking Oil 1L",    "Grocery",  180, 100, "");
p.run(s4, "Salt 1kg",          "Grocery",  20,  300, "");
p.run(s4, "Turmeric Powder",   "Grocery",  35,  150, "");
p.run(s4, "Chilli Powder",     "Grocery",  40,  150, "");
p.run(s4, "Coriander Powder",  "Grocery",  30,  150, "");
p.run(s4, "Tea Powder 250g",   "Grocery",  90,  120, "");
p.run(s4, "Coffee Powder",     "Grocery",  110, 100, "");
p.run(s4, "Soap",              "Grocery",  40,  200, "");
p.run(s4, "Shampoo 200ml",     "Grocery",  120, 80,  "");
p.run(s4, "Toothpaste",        "Grocery",  65,  150, "");
p.run(s4, "Detergent 500g",    "Grocery",  85,  120, "");
p.run(s4, "Biscuits",          "Food",     25,  200, "");
p.run(s4, "Chocolate",         "Food",     50,  150, "");
p.run(s4, "Juice 1L",          "Food",     90,  80,  "");

// ── SHOP 5 — Mobile World ──
p.run(s5, "Smartphone",        "Electronics", 12999, 15, "");
p.run(s5, "Tablet",            "Electronics", 18999, 8,  "");
p.run(s5, "Earphones",         "Electronics", 399,   40, "");
p.run(s5, "Charger 20W",       "Electronics", 599,   60, "");
p.run(s5, "Screen Guard",      "Electronics", 99,    120,"");
p.run(s5, "Phone Cover",       "Electronics", 199,   100,"");
p.run(s5, "Power Bank 20000mAh","Electronics",1599,  20, "");
p.run(s5, "TWS Earbuds",       "Electronics", 1299,  25, "");
p.run(s5, "Smart Watch",       "Electronics", 2999,  12, "");
p.run(s5, "USB-C Cable",       "Electronics", 149,   80, "");
p.run(s5, "Memory Card 32GB",  "Electronics", 449,   50, "");

// ── SHOP 6 — Bakery & Sweets ──
p.run(s6, "White Bread",       "Food", 35,  60,  "");
p.run(s6, "Brown Bread",       "Food", 45,  50,  "");
p.run(s6, "Croissant",         "Food", 30,  40,  "");
p.run(s6, "Cake Slice",        "Food", 60,  30,  "");
p.run(s6, "Muffin",            "Food", 40,  50,  "");
p.run(s6, "Cookies (6 pack)",  "Food", 80,  60,  "");
p.run(s6, "Puff Pastry",       "Food", 25,  80,  "");
p.run(s6, "Gulab Jamun",       "Food", 50,  100, "");
p.run(s6, "Ladoo (250g)",      "Food", 120, 70,  "");
p.run(s6, "Halwa",             "Food", 90,  60,  "");
p.run(s6, "Milk 500ml",        "Grocery", 28, 100,"");
p.run(s6, "Butter 100g",       "Grocery", 60, 80, "");

// ── SHOP 7 — Pharmacy ──
p.run(s7, "Paracetamol",       "Medicine", 18,  400, "");
p.run(s7, "Ibuprofen",         "Medicine", 35,  300, "");
p.run(s7, "Vitamin D3",        "Medicine", 180, 150, "");
p.run(s7, "Multivitamin",      "Medicine", 250, 100, "");
p.run(s7, "Calcium Tablets",   "Medicine", 140, 120, "");
p.run(s7, "Iron Tablets",      "Medicine", 90,  150, "");
p.run(s7, "Antiseptic Cream",  "Medicine", 65,  200, "");
p.run(s7, "Band Aid",          "Medicine", 40,  300, "");
p.run(s7, "Nasal Spray",       "Medicine", 120, 80,  "");
p.run(s7, "Cough Drops",       "Medicine", 30,  250, "");
p.run(s7, "Hand Sanitizer",    "Medicine", 75,  200, "");
p.run(s7, "Pulse Oximeter",    "Medicine", 850, 25,  "");
p.run(s7, "Glucometer",        "Medicine", 1200,20,  "");

// ── SHOP 8 — Fashion Store ──
p.run(s8, "T-Shirt",           "Clothing", 299,  50, "");
p.run(s8, "Jeans",             "Clothing", 899,  30, "");
p.run(s8, "Kurti",             "Clothing", 499,  40, "");
p.run(s8, "Saree",             "Clothing", 1299, 20, "");
p.run(s8, "Formal Shirt",      "Clothing", 699,  35, "");
p.run(s8, "Trousers",          "Clothing", 799,  30, "");
p.run(s8, "Dupatta",           "Clothing", 199,  60, "");
p.run(s8, "Leggings",          "Clothing", 249,  80, "");
p.run(s8, "Socks (3 pack)",    "Clothing", 99,   100,"");
p.run(s8, "Belt",              "Clothing", 299,  45, "");
p.run(s8, "Handbag",           "Clothing", 599,  25, "");
p.run(s8, "Wallet",            "Clothing", 349,  40, "");

// ── SHOP 9 — Stationery World ──
p.run(s9, "Pen",               "Stationery", 10,  500, "");
p.run(s9, "Pencil",            "Stationery", 5,   600, "");
p.run(s9, "Notebook",          "Stationery", 40,  200, "");
p.run(s9, "Sketch Pens",       "Stationery", 60,  150, "");
p.run(s9, "Highlighter",       "Stationery", 35,  200, "");
p.run(s9, "Sticky Notes",      "Stationery", 50,  180, "");
p.run(s9, "Scissors",          "Stationery", 45,  120, "");
p.run(s9, "Glue Stick",        "Stationery", 25,  200, "");
p.run(s9, "Geometry Box",      "Stationery", 120, 80,  "");
p.run(s9, "Drawing Book",      "Stationery", 55,  100, "");
p.run(s9, "Marker Pens",       "Stationery", 80,  150, "");
p.run(s9, "File Folder",       "Stationery", 30,  200, "");
p.run(s9, "Stapler",           "Stationery", 110, 70,  "");
p.run(s9, "Tape",              "Stationery", 20,  300, "");
p.run(s9, "Correction Pen",    "Stationery", 30,  250, "");

// ── SHOP 10 — Organic Store ──
p.run(s10, "Organic Rice 1kg",  "Grocery", 120, 100, "");
p.run(s10, "Organic Dal 500g",  "Grocery", 90,  120, "");
p.run(s10, "Honey 250g",        "Grocery", 180, 80,  "");
p.run(s10, "Coconut Oil 500ml", "Grocery", 220, 60,  "");
p.run(s10, "Aloe Vera Gel",     "Medicine", 95, 100, "");
p.run(s10, "Neem Powder",       "Medicine", 60, 120, "");
p.run(s10, "Turmeric Milk Mix", "Grocery", 150, 80,  "");
p.run(s10, "Green Tea",         "Grocery", 180, 90,  "");
p.run(s10, "Herbal Shampoo",    "Grocery", 220, 60,  "");
p.run(s10, "Organic Soap",      "Grocery", 80,  100, "");
p.run(s10, "Flaxseeds 250g",    "Grocery", 70,  120, "");
p.run(s10, "Chia Seeds 200g",   "Grocery", 150, 80,  "");
p.run(s10, "Vitamin C Tablets", "Medicine", 130,150, "");
p.run(s10, "Moringa Powder",    "Medicine", 200, 70,  "");

// ── RATINGS ──
const r = db.prepare("INSERT INTO ratings (user_id, shop_id, rating, review) VALUES (?, ?, ?, ?)");
const u1 = c1.lastInsertRowid, u2 = c2.lastInsertRowid, u3 = c3.lastInsertRowid, u4 = c4.lastInsertRowid;

r.run(u1, s1, 5, "Great shop! Very helpful staff.");
r.run(u2, s1, 4, "Good products, reasonable prices.");
r.run(u3, s1, 4, "Nice variety of items.");
r.run(u1, s2, 4, "Nice electronics collection.");
r.run(u4, s2, 5, "Got my phone repaired quickly!");
r.run(u2, s2, 4, "Good range of accessories.");
r.run(u1, s3, 5, "Best medical store nearby!");
r.run(u3, s3, 5, "Always stocked with medicines.");
r.run(u2, s4, 4, "Great supermarket, fresh products.");
r.run(u4, s4, 4, "Good prices on groceries.");
r.run(u1, s5, 5, "Excellent mobile accessories.");
r.run(u3, s5, 4, "Wide range of phones.");
r.run(u2, s6, 5, "Best bakery in the area!");
r.run(u4, s6, 5, "Fresh bread every morning.");
r.run(u1, s7, 4, "Well stocked pharmacy.");
r.run(u3, s7, 5, "Pharmacist is very knowledgeable.");
r.run(u2, s8, 4, "Good fashion collection.");
r.run(u4, s8, 3, "Prices are a bit high.");
r.run(u1, s9, 5, "Best stationery shop!");
r.run(u3, s9, 5, "Everything available here.");
r.run(u2, s10, 5, "Love the organic products!");
r.run(u4, s10, 5, "Very healthy options available.");

console.log("✅ Database seeded successfully!");
console.log("");
console.log("⚠️  IMPORTANT: Shops are placed near BASE_LAT/BASE_LNG in seed.js");
console.log(`   Current base: ${BASE_LAT}, ${BASE_LNG} (Chennai)`);
console.log("   To use YOUR location: edit BASE_LAT and BASE_LNG in seed.js, then re-run node seed.js");
console.log("");
console.log("Test Accounts (all passwords: password123):");
console.log("  Customers : rupa@gmail.com, arjun@gmail.com, meena@gmail.com, karthik@gmail.com");
console.log("  Shop Owners: ramesh@gmail.com, priya@gmail.com, suresh@gmail.com, kavitha@gmail.com");
console.log("               vijay@gmail.com, lakshmi@gmail.com, murugan@gmail.com, deepa@gmail.com");
console.log("               senthil@gmail.com, anitha@gmail.com");
console.log("");
console.log("Shops: 10 shops across Chennai");
console.log("Products: 130+ products across Grocery, Electronics, Medicine, Food, Clothing, Stationery");
