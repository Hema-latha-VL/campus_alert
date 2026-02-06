import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/alerthub',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'CHANGE_ME_DEV_ONLY',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  
  cors: {
    origins: (process.env.CORS_ORIGINS || 'http://localhost:8080,http://localhost:8081,http://localhost:8082,http://localhost:5173,http://127.0.0.1:8080,http://127.0.0.1:8081,http://127.0.0.1:8082')
      .split(',')
      .map(o => o.trim())
      .filter(Boolean),
  },
  
  cookie: {
    secure: process.env.COOKIE_SECURE === 'true',
  },
};
