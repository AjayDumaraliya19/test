const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");

const routes = require("./routes/index.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.set("trust proxy", 1);

app.use(rateLimit({
    windowMs: 90000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requrest, please try again later..!"
}));

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (["http://localhost:3000"].includes(origin)) return callback(null, true);

        return callback(new Error("Not allowed by CORS police..!"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
    credentials: true
}));

app.get("/", (req, res) => res.status(200).json({ success: true, message: "API working" }));

app.get("/health", (req, res) => {
    return res.status(200).json({
        success: true,
        uptime: process.uptime(),
        timestamp: new Date.now()
    });
});

app.use("/api", routes);

app.use((err, req, res, next) => {
    return res.status(500).json({ success: false, message: err?.message || "Internal server error..!" });
});

module.exports = app;