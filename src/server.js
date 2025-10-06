"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const http_1 = __importDefault(require("http"));
const envVars_js_1 = require("./configs/envVars.js");
const app_js_1 = __importDefault(require("./app.js"));
const db_js_1 = require("./configs/db.js");
const seedOwner_js_1 = require("./utils/seedOwner.js");
let server = null;
async function connectDB() {
    try {
        await db_js_1.prisma.$connect();
        console.log("Database sucssfully connected");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        console.log(`Database connection failed ${error.message}`);
        process.exit(1);
    }
}
const startServer = async () => {
    const port = envVars_js_1.envVars.PORT;
    try {
        await connectDB();
        server = http_1.default.createServer(app_js_1.default);
        server.listen(port, () => {
            console.log(`🚀 Server is running on http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error(`Failed to start Server: ${error}`);
        process.exit(1);
    }
};
(async () => {
    await startServer();
    await (0, seedOwner_js_1.seedOwner)();
})();
