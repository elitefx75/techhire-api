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
const port = process.env.PORT || 4000;
const host = process.env.HOST || "0.0.0.0";
const displayHost = host === "0.0.0.0" ? "localhost" : host;
const isProduction = process.env.NODE_ENV === "production";

const getBaseUrl = () => {
    if (process.env.RENDER_EXTERNAL_URL) {
        return process.env.RENDER_EXTERNAL_URL.trim().replace(/\/$/, "");
    }
    if (process.env.APP_URL) {
        return process.env.APP_URL.trim().replace(/\/$/, "");
    }
    return `http://${displayHost}:${port}`;
};

const githubEnabled = Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);

const githubCallbackUrl = process.env.RENDER_EXTERNAL_URL || process.env.GITHUB_CALLBACK_URL || process.env.CALLBACK_URL || process.env.REDIRECT_URI || process.env.RE_DIRECT_URI || `${getBaseUrl()}/api/auth/github/callback`;

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

// Database connection monitoring
mongoose.connection.on('connected', () => {
    console.log("MongoDB connection established");
});

mongoose.connection.on('disconnected', () => {
    console.log("MongoDB connection lost");
});

mongoose.connection.on('error', (error) => {
    console.warn("MongoDB connection error:", error.message);
});

app.use("/api-docs", swagger.serve, swagger.setup);

// Health check endpoint
app.get('/health', (req, res) => {
    const mongoStatus = mongoose.connection.readyState;
    const statusMap = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };

    res.json({
        status: mongoStatus === 1 ? 'healthy' : 'degraded',
        database: statusMap[mongoStatus],
        timestamp: new Date().toISOString()
    });
});

app.get('/login', (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return res.send(`
            <h1>TechHire api is running</h1>
        `);
    }

    // Redirect straight to GitHub OAuth instead of showing an authorization page
    return res.redirect('/api/auth/github');
});

app.get('/logout', (req, res, next) => {
    req.logout((error) => {
        if (error) {
            return next(error);
        }

        req.session.destroy(() => {
            res.send(`
                <h1>Logged out successfully</h1>
            `);
        });
    });
});

app.get("/", (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        const baseUrl = getBaseUrl();
        return res.send(`TechHire API is running`);
    }

    return res.status(200).send(`
        <p>You are logged out.</p>
    `);
});

app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);

app.listen(port, host, () => {
    console.log(`Server running on http://${displayHost}:${port}`);
});

mongoose
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    retryWrites: true,
    retryReads: true,
    maxPoolSize: 10,
    minPoolSize: 2,
    family: 4
  })
  .then(() => {
    console.log("MongoDB connected successfully");

    // Start server only after DB connection
    app.listen(port, host, () => {
      console.log(`Server running on http://${displayHost}:${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Exit so Render restarts the service
  });