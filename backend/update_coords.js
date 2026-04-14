const db = require("./db");

const BASE_LAT = 11.295485;
const BASE_LNG = 77.663316;

function offset(lat, lng, dLatKm, dLngKm) {
  return [
    lat + (dLatKm / 111),
    lng + (dLngKm / (111 * Math.cos(lat * Math.PI / 180)))
  ];
}

const positions = [
  { name: "Ramesh General Store",     ...coords(offset(BASE_LAT, BASE_LNG,  0.5,  0.3)) },
  { name: "Priya Electronics Hub",    ...coords(offset(BASE_LAT, BASE_LNG, -0.8,  1.2)) },
  { name: "Suresh Medical Store",     ...coords(offset(BASE_LAT, BASE_LNG,  1.5, -0.5)) },
  { name: "Kavitha Supermarket",      ...coords(offset(BASE_LAT, BASE_LNG, -1.2, -1.8)) },
  { name: "Vijay Mobile World",       ...coords(offset(BASE_LAT, BASE_LNG,  2.5,  2.0)) },
  { name: "Lakshmi Bakery & Sweets",  ...coords(offset(BASE_LAT, BASE_LNG, -2.0,  0.8)) },
  { name: "Murugan Pharmacy",         ...coords(offset(BASE_LAT, BASE_LNG,  3.0, -2.5)) },
  { name: "Deepa Fashion Store",      ...coords(offset(BASE_LAT, BASE_LNG, -3.5, -1.0)) },
  { name: "Senthil Stationery World", ...coords(offset(BASE_LAT, BASE_LNG,  0.2,  4.0)) },
  { name: "Anitha Organic Store",     ...coords(offset(BASE_LAT, BASE_LNG,  4.5,  1.5)) },
  { name: "Fresh Mart",               ...coords(offset(BASE_LAT, BASE_LNG,  0.3, -0.2)) },
  { name: "Daily Needs Store",        ...coords(offset(BASE_LAT, BASE_LNG, -0.4,  0.5)) },
  { name: "City Mart",                ...coords(offset(BASE_LAT, BASE_LNG,  0.8,  0.6)) },
];

function coords([lat, lng]) { return { lat, lng }; }

const stmt = db.prepare("UPDATE shops SET lat = ?, lng = ? WHERE name = ?");
positions.forEach(({ name, lat, lng }) => {
  const result = stmt.run(lat, lng, name);
  console.log(`${result.changes > 0 ? "✅" : "⚠️ "} ${name} → (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
});

console.log("\nAll shop coordinates updated to Erode area!");
