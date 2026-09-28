/* eslint-disable no-console */
import http, { Server } from 'http';
import { envVars } from './configs/envVars';
import app from './app';
import { prisma } from './configs/db.js';
import { seedOwner } from './utils/seedOwner';

let server: Server | null = null;

async function connectDB() {
  try {
    await prisma.$connect();
    console.log('Database sucssfully connected');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`Database connection failed ${error.message}`);
    process.exit(1);
  }
}

async function gracefulShutdown(signal: string) {
  console.log(`${signal} received. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      console.log('HTTP server closed.');
      try {
        await prisma.$disconnect();
        console.log('Database connection closed.');
      } catch (error) {
        console.error('Error during database disconnect:', error);
      }
      process.exit(0);
    });

    // Force shutdown after timeout
    setTimeout(() => {
      console.error('Could not close connections in time, shutting down forcefully.');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
}

const startServer = async () => {
  const port = Number(envVars.PORT);
  if (!port || isNaN(port)) {
    console.error('Port is not defined');
    process.exit(1);
  }

  try {
    await connectDB();
    server = http.createServer(app);

    server.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error(`Failed to start Server: ${error}`);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

(async () => {
  await startServer();
  try {
    await seedOwner();
  } catch (error) {
    console.error('Owner seeding failed, but server remains running.', error);
  }
})();
