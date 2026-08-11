const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const mongoose = require("mongoose");
const swagger = require("./swagger");
const passport = require('./config/passport');
const { ensureAuthenticated } = require('./middleware/auth');
require('./models/user');
const authRoutes = require("./routes/auth");
const equipmentRoutes = require("./routes/equipment");
const bookingRoutes = require("./routes/booking");
const paymentRoutes = require("./routes/payment");
const reviewRoutes = require("./routes/review");

const app = express();
const port = process.env.PORT || 5003;
const host = process.env.HOST || "0.0.0.0";
const isProduction = process.env.NODE_ENV === "production";
const getBaseUrl = () => {
    if (process.env.RENDER_EXTERNAL_URL) {
        return process.env.RENDER_EXTERNAL_URL.trim().replace(/\/$/, "");
    }
    if (process.env.APP_URL) {
        return process.env.APP_URL.trim().replace(/\/$/, "");
    }
    return `http://${host}:${port}`;
};

const githubEnabled = Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
const githubCallbackUrl = process.env.GITHUB_CALLBACK_URL || process.env.CALLBACK_URL || process.env.REDIRECT_URI || process.env.RE_DIRECT_URI || `${getBaseUrl()}/api/auth/github/callback`;

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/techhire";

app.set("trust proxy", 1);
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || "techhire-secret",
    resave: false,
    saveUninitialized: false,
    proxy: isProduction,
    cookie: {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        maxAge: 1000 * 60 * 60 * 24
    }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api-docs", ensureAuthenticated, swagger.serve, swagger.setup);

app.get('/login', (req, res) => {
    return res.status(401).send(`
        <h1>Authorization required</h1>
        <p>Please authenticate before using TechHire API.</p>
        <a href="/api/auth/github">Authorize with GitHub</a>
    `);
});

app.get("/", ensureAuthenticated, (req, res) => {
    return res.send("TechHire app is running");
});

app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);

const startServer = () => {
    const server = app.listen(port, host, () => {
        console.log(`Server running on  http://${host}:${port}`);
    });

    server.on("error", (error) => {
        console.error("Server error:", error);
        process.exit(1);
    });
};

startServer();

mongoose
    .connect(mongoUri, {
        serverSelectionTimeoutMS: 3000,
        socketTimeoutMS: 3000,
        connectTimeoutMS: 3000
    })
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.warn("MongoDB connection failed, continuing without database:", error.message);
    });

