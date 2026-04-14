const db = require("./db");

const updates = [
  { name: "Ramesh General Store",     address: "Veppampalayam Main Road, Erode" },
  { name: "Priya Electronics Hub",    address: "Brough Road, Erode Town" },
  { name: "Suresh Medical Store",     address: "Perundurai Road, Erode" },
  { name: "Kavitha Supermarket",      address: "Surampatti, Erode" },
  { name: "Vijay Mobile World",       address: "EVN Road, Erode Town" },
  { name: "Lakshmi Bakery & Sweets",  address: "Chithode Road, Erode" },
  { name: "Murugan Pharmacy",         address: "Kodumudi Main Road, Erode" },
  { name: "Deepa Fashion Store",      address: "Kangeyam Road, Erode" },
  { name: "Senthil Stationery World", address: "Cauvery Nagar, Erode" },
  { name: "Anitha Organic Store",     address: "Thindal, Erode" },
  { name: "Fresh Mart",               address: "Near Muthu Mahal, Veppampalayam, Erode" },
  { name: "Daily Needs Store",        address: "Karungalpalayam, Erode" },
  { name: "City Mart",                address: "Four Roads, Erode Town" },
];

const stmt = db.prepare("UPDATE shops SET address = ? WHERE name = ?");
updates.forEach(({ name, address }) => {
  const result = stmt.run(address, name);
  console.log(`${result.changes > 0 ? "✅" : "⚠️ "} ${name} → ${address}`);
});

console.log("\nAll addresses updated!");
