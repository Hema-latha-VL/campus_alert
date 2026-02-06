import mongoose from 'mongoose';

export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      NODE_ENV?: 'development' | 'production' | 'test';
      MONGODB_URI?: string;
      JWT_SECRET?: string;
      JWT_EXPIRES_IN?: string;
      CORS_ORIGINS?: string;
      COOKIE_SECURE?: string;
    }
  }
}
