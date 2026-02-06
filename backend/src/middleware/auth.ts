import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/security';
import { User, IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

const extractToken = (req: Request): string | null => {
  // Check cookie first
  const cookie = req.cookies?.alerthub_access;
  if (cookie) {
    return cookie;
  }

  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    const token = authHeader.substring(7).trim();
    return token || null;
  }

  return null;
};

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);

    if (!token) {
      res.status(401).json({ detail: 'Not authenticated' });
      return;
    }

    let payload: TokenPayload;
    try {
      payload = verifyToken(token);
    } catch (error) {
      res.status(401).json({ detail: 'Invalid token' });
      return;
    }

    const { sub: loginName, role } = payload;

    if (!loginName || !role) {
      res.status(401).json({ detail: 'Invalid token' });
      return;
    }

    const user = await User.findOne({ loginName, role });

    if (!user) {
      res.status(401).json({ detail: 'Invalid session' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
};
