const express = require("express");
const cors = require("cors");

const app = express();
const PORT = Number(process.env.PORT || 8080);

const PROVIDER_URL =
  process.env.PROVIDER_URL ||
  "https://api.gold-api.com/price/XAU";

app.disable("x-powered-by");

app.use(cors({
  origin: true,
  methods: ["GET"]
}));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.json({
    service: "Gold Signal Robot V21",
    status: "online",
    paperMode: true
  });
});

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "Gold Signal Robot V21",
    timestamp: new Date().toISOString()
  });
});

app.get("/config", (req, res) => {
  res.json({
    symbol: "XAUUSD",
    timeframes: ["M5", "M15"],
    paperMode: true
  });
});

app.listen(PORT, () => {
  console.log(`Gold Signal Robot V21 running on port ${PORT}`);
});
