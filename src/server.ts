/* eslint-disable no-console */
import { envVars } from './configs/envVars';
import app from './app';
import { prisma } from './configs/db.js';
import { seedOwner } from './utils/seedOwner';

async function connectDB() {
  try {
    await prisma.$connect();
    console.log('Database successfully connected');
  } catch (error: any) {
    console.error(`Database connection failed: ${error.message}`);
    throw error;
  }
}

const startServer = async () => {
  try {
    await connectDB();
    await seedOwner();

    const port = envVars.PORT;

    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error(`Failed to start Server: ${error}`);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'production') {
  startServer();
}

export default app;




// /* eslint-disable no-console */
// import http, { Server } from 'http';
// import { envVars } from './configs/envVars';
// import app from './app';
// import { prisma } from './configs/db.js';
// import { seedOwner } from './utils/seedOwner';

// let server: Server | null = null;

// async function connectDB() {
//   try {
//     await prisma.$connect();
//     console.log('Database sucssfully connected');
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     console.log(`Database connection failed ${error.message}`);
//     process.exit(1);
//   }
// }

// const startServer = async () => {
//   const port = envVars.PORT as string;
//   try {
//     await connectDB();
//     server = http.createServer(app);

//     server.listen(port, () => {
//       console.log(`🚀 Server is running on http://localhost:${port}`);
//     });
//   } catch (error) {
//     console.error(`Failed to start Server: ${error}`);
//     process.exit(1);
//   }
// };

// (async () => {
//   await startServer();
//   await seedOwner();
// })();
