const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const swagger = require("./swagger");
const equipmentRoutes = require("./routes/equipment");
const bookingRoutes = require("./routes/booking");

const app = express();
const port = Number(process.env.PORT) || 5003;
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
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use("/api-docs", swagger.serve, swagger.setup);

app.get("/", (req, res) => {
    res.send("TechHire app is running");
});

app.use("/api/equipment", equipmentRoutes);
app.use("/api/bookings", bookingRoutes);

const startServer = (serverPort) => {
    const server = app.listen(serverPort, () => {
        console.log(`Server running on http://localhost:${serverPort}`);
    });

    server.on("error", (error) => {
        if (error.code === "EADDRINUSE") {
            startServer(serverPort + 1);
            return;
        }

        console.error("Server error:", error);
        process.exit(1);
    });
};

startServer(port);

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

