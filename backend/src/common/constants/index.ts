export const APP_CONSTANTS = {
  API_PREFIX: 'api/v1',
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

export const DATABASE_CONSTANTS = {
  DATABASE_URL: process.env.DATABASE_URL,
} as const;

export const JWT_CONSTANTS = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
} as const; 