// Logger package
import pino from 'pino';
import pretty from 'pino-pretty';

// Log level
const logLevel = process.env.LOG_LEVEL || 'debug';
const stream = pretty({
  colorize: true,
  errorProps: '*',
  translateTime: true,
  ignore: 'pid,hostname',
});

export const logger = pino({
  level: logLevel,
  name: 'blockchain-syncing-backend'
}, stream)