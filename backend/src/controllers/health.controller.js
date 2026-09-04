import { getDBStatus } from '../config/db.js';

// package.json version, read once at module load
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(path.join(__dirname, '../../package.json'), 'utf-8'));

/**
 * GET /api/health
 * Public health check. Deliberately avoids exposing sensitive
 * infrastructure details (no host/IP/connection strings).
 */
export const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    data: {
      database: getDBStatus(),
      uptimeSeconds: Math.floor(process.uptime()),
      version: pkg.version,
    },
  });
};
