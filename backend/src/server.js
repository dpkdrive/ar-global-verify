import app from './app.js';
import env from './config/env.js';
import logger from './config/logger.js';
import { connectDB, disconnectDB } from './config/db.js';


import dns from "dns"
dns.setDefaultResultOrder("ipv4first");
dns.setServers(['8.8.8.8', '8.8.4.4']);


let server;

const start = async () => {
  // Fail fast if DB is unavailable — connectDB() exits the process on failure.
  await connectDB();

  server = app.listen(env.PORT, () => {
    logger.info(
      `Server running in ${env.NODE_ENV} mode on port ${env.PORT} (API version: ${env.API_VERSION})`
    );
  });
};

const shutdown = async (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');
      await disconnectDB();
      process.exit(0);
    });

    // Force-exit if shutdown hangs beyond a reasonable window
    setTimeout(() => {
      logger.error('Graceful shutdown timed out. Forcing exit.');
      process.exit(1);
    }, 10000).unref();
  } else {
    await disconnectDB();
    process.exit(0);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled Promise Rejection');
});

process.on('uncaughtException', (err) => {
  logger.error({ err }, 'Uncaught Exception. Shutting down.');
  process.exit(1);
});

start();
