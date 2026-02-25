require('dotenv').config();

const express = require("express");
const cors = require("cors");
const app = express();

// ✅ CORS — must be FIRST, before all routes
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (origin.startsWith('http://localhost')) return callback(null, true);
        if (origin.endsWith('.vercel.app')) return callback(null, true);
        return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "accessToken"],
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// ✅ Handle ALL preflight OPTIONS requests
app.options(/(.*)/, cors(corsOptions));

app.use(express.json());

// Request logger
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.path}`);
    next();
});

// Routes
const postRouter = require('./routes/Posts');
app.use("/posts", postRouter);

const commentsRouter = require('./routes/Comments');
app.use("/comments", commentsRouter);

const usersRouter = require('./routes/Users');
app.use("/auth", usersRouter);

const likesRouter = require('./routes/Likes');
app.use("/likes", likesRouter);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

const db = require("./models");

// ✅ Sync DB and start server

// db.sequelize.sync().then(() => {
//     app.listen(3001, () => {
//         console.log("Server running on port 3001");
//     });
// }).catch(err => {
//     console.error("DB sync failed:", err);
// });

// ✅ Export for Vercel serverless
module.exports = app;
