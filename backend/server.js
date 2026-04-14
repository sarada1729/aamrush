const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5050;
const DATA_FILE = path.join(__dirname, "locations.json");

// allow your Vercel site + local testing
const allowedOrigins = [
    "http://localhost:3000",
    "https://aamrush.vercel.app",
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"));
        },
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("AamRush backend is running");
});

app.get("/locations", (req, res) => {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return res.json([]);
        }

        const raw = fs.readFileSync(DATA_FILE, "utf8").trim();
        if (!raw) {
            return res.json([]);
        }

        const data = JSON.parse(raw);
        return res.json(data);
    } catch (err) {
        console.error("GET /locations error:", err);
        return res.status(500).json({ error: "Failed to read locations" });
    }
});

app.post("/save-location", (req, res) => {
    try {
        const newLocation = req.body;

        let existing = [];
        if (fs.existsSync(DATA_FILE)) {
            const raw = fs.readFileSync(DATA_FILE, "utf8").trim();
            existing = raw ? JSON.parse(raw) : [];
        }

        existing.push(newLocation);
        fs.writeFileSync(DATA_FILE, JSON.stringify(existing, null, 2));

        console.log("Saved location:", newLocation);
        return res.json({ success: true });
    } catch (err) {
        console.error("POST /save-location error:", err);
        return res.status(500).json({ error: "Failed to save location" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});