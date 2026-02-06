import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/index';

export interface TokenPayload {
  sub: string;
  role: string;
}

export const createAccessToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: config.jwt.expiresIn,
  } as SignOptions;
  return jwt.sign(payload, String(config.jwt.secret), options);
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, String(config.jwt.secret)) as TokenPayload;
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
