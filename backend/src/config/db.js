import mongoose from 'mongoose';
import env from './env.js';
import logger from './logger.js';

mongoose.set('strictQuery', true);

let isConnected = false;

/**
 * Connect to MongoDB. The application must not silently continue
 * if the database connection is unavailable at startup.
 */
export const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      isConnected = true;
      logger.info('MongoDB connection established');
    });

    mongoose.connection.on('error', (err) => {
      logger.error({ err }, 'MongoDB connection error');
    });

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      logger.warn('MongoDB disconnected');
    });

    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    return mongoose.connection;
  } catch (err) {
    logger.error({ err }, 'Failed to connect to MongoDB at startup. Exiting process.');
    // Fail fast: do not let the app run in a half-initialized state.
    process.exit(1);
  }
};

export const getDBStatus = () => {
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return stateMap[mongoose.connection.readyState] ?? 'unknown';
};

export const isDBConnected = () => isConnected;

/**
 * Gracefully close the MongoDB connection.
 * Used on SIGINT/SIGTERM to avoid dropping in-flight operations abruptly.
 */
export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed gracefully');
  } catch (err) {
    logger.error({ err }, 'Error while closing MongoDB connection');
  }
};

export default mongoose;
