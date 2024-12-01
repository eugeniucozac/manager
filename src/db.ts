import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);
let db: Db;

/**
 * Establishes a connection to the MongoDB database.
 * - Sets the `db` variable to the specific database (`taskManager`).
 * - Logs success or throws an error if the connection fails.
 */
async function connectToDB(): Promise<void> {
  try {
    await client.connect();
    db = client.db('taskManager');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

/**
 * Closes the connection to the MongoDB database.
 * - Ensures cleanup of the client resource when the application shuts down.
 */
async function disconnectDB(): Promise<void> {
  try {
    await client.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
}

export { db, connectToDB, disconnectDB };
