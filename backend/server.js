const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// === Serve Frontend Files ===
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// === Data setup ===
const dataDir = path.join(__dirname, "data");
const carsFile = path.join(dataDir, "cars.json");

// Make sure data folder and file exist
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(carsFile)) fs.writeFileSync(carsFile, "[]", "utf-8");

let cars = [];
try {
  cars = JSON.parse(fs.readFileSync(carsFile, "utf-8"));
} catch (err) {
  console.error("Error reading cars.json — resetting file...");
  fs.writeFileSync(carsFile, "[]", "utf-8");
  cars = [];
}

// === API Routes ===
app.get("/api/cars", (req, res) => {
  res.json(cars);
});

app.post("/api/cars", (req, res) => {
  const newCar = req.body;
  cars.push(newCar);
  fs.writeFileSync(carsFile, JSON.stringify(cars, null, 2));
  res.json({ message: "Car added successfully!" });
});

// === Catch-all: send frontend ===
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});



// === Start Server ===
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
  console.log(`🖥️ Frontend available at: http://localhost:${PORT}`);
});
