/* eslint-disable no-console */
import http, { Server } from "http";
import { envVars } from "./configs/envVars.js";
import app from "./app.js";
import { prisma } from "./configs/db.js";
import { seedOwner } from "./utils/seedOwner.js";

let server: Server | null = null;

async function connectDB() {
  try {
    await prisma.$connect();
    console.log("Database sucssfully connected");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(`Database connection failed ${error.message}`);
    process.exit(1);
  }
}

const startServer = async () => {
  const port = envVars.PORT as string;
  try {
    await connectDB();
    server = http.createServer(app);

    server.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error(`Failed to start Server: ${error}`);
    process.exit(1);
  }
};

(async () => {
  await startServer();
  await seedOwner();
})();
