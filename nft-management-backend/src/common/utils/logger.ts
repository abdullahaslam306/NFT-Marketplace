// Logger package
import * as pino from 'pino';
import pretty from 'pino-pretty';

// Log level
const logLevel = process.env.LOG_LEVEL || 'debug';
const stream = pretty({
  colorize: true,
  ignore: 'pid,hostname',
});

export const logger = pino({
  level: logLevel,
  name: 'nft-management-backend'
}, stream);
