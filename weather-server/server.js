// server.js
const express = require("express");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

// Middleware za CORS i JSON
const cors = require("cors");
app.use(cors());
app.use(express.json());

// Ruta za test
app.get("/", (req, res) => {
  res.send("🌍 Weather server radi!");
});

// Ruta za vremensku prognozu
app.get("/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Greška na serveru", details: err.message });
  }
});

// Pokretanje servera
app.listen(PORT, () => {
  console.log(`✅ Server radi na http://localhost:${PORT}`);
});
