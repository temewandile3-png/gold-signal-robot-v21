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
app.get("/xauusd", async (req, res) => {
  try {
    const response = await fetch(PROVIDER_URL, {
      headers: {
        Accept: "application/json"
      },
      cache: "no-store",
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`Provider HTTP ${response.status}`);
    }

    const data = await response.json();

    const price = Number(
      data.price ??
      data.price_usd ??
      data.XAU?.price
    );

    if (!Number.isFinite(price) || price <= 0) {
      throw new Error("No valid XAU price returned");
    }

    res.set("Cache-Control", "no-store");

    res.json({
      symbol: "XAUUSD",
      price,
      source: "Gold API",
      timestamp: new Date().toISOString(),
      paperMode: true
    });

  } catch (error) {
    console.error("XAUUSD feed error:", error.message);

    res.status(502).json({
      error: "XAUUSD market data unavailable"
    });
  }
});
app.listen(PORT, () => {
  console.log(`Gold Signal Robot V21 running on port ${PORT}`);
});
