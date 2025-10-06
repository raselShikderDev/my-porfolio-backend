"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const envVars_js_1 = require("./configs/envVars.js");
const notFound_js_1 = __importDefault(require("./middlewares/notFound.js"));
const globalError_js_1 = __importDefault(require("./middlewares/globalError.js"));
const mainRouter_js_1 = require("./routes/mainRouter.js");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: envVars_js_1.envVars.FRONTEND_URL,
    credentials: true
}));
app.use("/api/v1", mainRouter_js_1.appRoutes);
app.get("/", (req, res) => {
    res.send("Welcome to th my porfolio - Rasel Shikder");
});
app.use(globalError_js_1.default);
app.use(notFound_js_1.default);
exports.default = app;
