"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, ".env") });
console.log("Backend Environment Status Check:");
console.log("- ADMIN_EMAIL:", process.env.ADMIN_EMAIL ? "Loaded" : "MISSING");
console.log("- JWT_SECRET_ADMIN:", process.env.JWT_SECRET_ADMIN ? "Loaded" : "MISSING");
const DB_1 = __importDefault(require("./Config/DB"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const UserRoutes_1 = __importDefault(require("./Routes/UserRoutes"));
const AdminRoutes_1 = __importDefault(require("./Routes/AdminRoutes"));
const TheaterRoutes_1 = __importDefault(require("./Routes/TheaterRoutes"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const Socket_1 = require("./Config/Socket");
Socket_1.app.set("io", Socket_1.io);
DB_1.default.connectDB();
const port = process.env.PORT || 5000;
Socket_1.app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        const allowedOrigins = [
            "http://localhost:3000",
            "https://ticket-hive-awft.vercel.app"
        ];
        if (!origin)
            return callback(null, true);
        const normalizedOrigin = origin.replace(/\/$/, '');
        if (allowedOrigins.includes(normalizedOrigin)) {
            callback(null, true);
        }
        else {
            console.warn(`CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}));
Socket_1.app.use(express_1.default.json());
Socket_1.app.use(express_1.default.urlencoded({ extended: true }));
Socket_1.app.use((0, cookie_parser_1.default)());
Socket_1.app.use((0, morgan_1.default)('dev'));
const staticPath = path_1.default.join(__dirname, process.env.NODE_ENV === 'production' ? '../public' : 'public');
Socket_1.app.use(express_1.default.static(staticPath));
Socket_1.app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});
Socket_1.app.use("/api/users", UserRoutes_1.default);
Socket_1.app.use("/api/admin", AdminRoutes_1.default);
Socket_1.app.use("/api/theater", TheaterRoutes_1.default);
Socket_1.app.use((err, req, res, next) => {
    console.error("Caught error in Global Error Handler:", err);
    const status = err.status || 500;
    res.status(status).json({
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
});
Socket_1.server.listen(port, () => console.log(`Server Is Running On Port http://localhost:${port}/`));
//# sourceMappingURL=server.js.map