import app from './app';
import { connectToDB, disconnectDB } from './db';

const PORT = process.env.PORT || 3001;

/**
 * Immediately Invoked Function Expression (IIFE)
 * - Handles the initialization of the server and database connection.
 */
(async () => {
  try {
    await connectToDB();
    console.log('Connected to the database');

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    process.on('SIGINT', async () => {
      console.log('Shutting down...');
      await disconnectDB();
      server.close(() => {
        console.log('Server and database connections closed');
        process.exit(0);
      });
    });
  } catch (err) {
    console.error('Failed to start the server:', err);
    process.exit(1);
  }
})();
