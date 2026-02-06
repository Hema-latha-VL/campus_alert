import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User, type UserRole } from '../models/User';
import { createAccessToken, hashPassword, verifyPassword } from '../utils/security';
import { authenticate, AuthRequest } from '../middleware/auth';
import { config } from '../config';

const router = Router();

const ADMIN_LOGIN = 'kec@kongu.edu';
const ADMIN_PASSWORD = 'Test@1234';

interface LoginRequest {
  role: UserRole;
  loginName: string;
  password: string;
}

interface SignupRequest {
  firstName: string;
  lastName: string;
  loginName: string;
  email: string;
  department: string;
  advisorName: string;
  advisorLoginName?: string;
  phoneNumber: string;
  password: string;
}

interface AdvisorCreateRequest {
  firstName: string;
  lastName: string;
  loginName: string;
  email: string;
  department: string;
  phoneNumber: string;
  password: string;
}

interface MeResponse {
  id: string;
  role: UserRole;
  loginName: string;
  status: string;
  advisorLoginName?: string;
  advisorName?: string;
}

const setAuthCookie = (res: Response, token: string) => {
  res.cookie('alerthub_access', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.cookie.secure,
    path: '/',
    maxAge: 24 * 60 * 60 * 1000,
  });
};

// POST /api/auth/login
router.post(
  '/login',
  [
    body('role').isIn(['student', 'advisor', 'admin']).withMessage('Invalid role'),
    body('loginName').isString().trim().notEmpty(),
    body('password').isString().notEmpty(),
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ detail: 'Invalid credentials' });
        return;
      }

      const { role, loginName, password }: LoginRequest = req.body;

      if (role === 'admin') {
        if (loginName !== ADMIN_LOGIN || password !== ADMIN_PASSWORD) {
          res.status(401).json({ detail: 'Invalid credentials' });
          return;
        }

        let admin = await User.findOne({ loginName, role: 'admin' });
        if (!admin) {
          const passwordHash = await hashPassword(ADMIN_PASSWORD);
          admin = await User.create({
            firstName: 'System',
            lastName: 'Admin',
            loginName,
            department: 'Administration',
            role: 'admin',
            status: 'active',
            phoneNumber: '0000000000',
            passwordHash,
          });
        }

        const token = createAccessToken({ sub: admin.loginName, role: admin.role });
        setAuthCookie(res, token);
        res.json({ access_token: token, token_type: 'bearer', id: admin._id?.toString(), role: admin.role, loginName: admin.loginName });
        return;
      }

      const user = await User.findOne({ loginName, role });
      if (!user) {
        res.status(401).json({ detail: 'Invalid credentials' });
        return;
      }

      if (role === 'student' && user.status === 'pending') {
        res.status(403).json({ detail: 'accept pending' });
        return;
      }

      if (role === 'student' && user.status !== 'approved') {
        res.status(403).json({ detail: 'access not approved' });
        return;
      }

      if (role === 'advisor' && user.status !== 'active') {
        res.status(403).json({ detail: 'access not active' });
        return;
      }

      const ok = await verifyPassword(password, user.passwordHash);
      if (!ok) {
        res.status(401).json({ detail: 'Invalid credentials' });
        return;
      }

      const token = createAccessToken({ sub: user.loginName, role: user.role });
      setAuthCookie(res, token);
      res.json({ access_token: token, token_type: 'bearer', id: user._id?.toString(), role: user.role, loginName: user.loginName });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ detail: 'Internal server error' });
    }
  }
);

// POST /api/auth/signup (student only)
router.post(
  '/signup',
  [
    body('firstName').isString().trim().notEmpty(),
    body('lastName').isString().trim().notEmpty(),
    body('loginName').isString().trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('department').isString().trim().notEmpty(),
    body('advisorName').isString().trim().notEmpty(),
    body('phoneNumber').isString().trim().notEmpty(),
    body('password').isString().notEmpty(),
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ detail: 'Invalid signup data' });
        return;
      }

      const payload: SignupRequest = req.body;
      const exists = await User.findOne({ 
        $or: [
          { loginName: payload.loginName },
          { email: payload.email }
        ]
      });
      if (exists) {
        if (exists.loginName === payload.loginName) {
          res.status(409).json({ detail: 'Login name already exists' });
        } else {
          res.status(409).json({ detail: 'Email already exists' });
        }
        return;
      }

      const advisorLookup = payload.advisorLoginName?.trim() || payload.advisorName.trim();
      const advisor = await User.findOne({
        role: 'advisor',
        $or: [
          { loginName: advisorLookup },
          { $expr: { $eq: [{ $concat: ['$firstName', ' ', '$lastName'] }, advisorLookup] } },
        ],
      });

      if (!advisor) {
        res.status(400).json({ detail: 'Advisor not found' });
        return;
      }

      const passwordHash = await hashPassword(payload.password);
      await User.create({
        firstName: payload.firstName,
        lastName: payload.lastName,
        loginName: payload.loginName,
        email: payload.email,
        department: payload.department,
        advisorName: payload.advisorName,
        advisorLoginName: advisor?.loginName,
        role: 'student',
        status: 'pending',
        phoneNumber: payload.phoneNumber,
        passwordHash,
        notificationPreferences: {
          email: false,
          push: true,
          urgent: true,
          eventReminders: false,
        },
      });

      res.status(201).json({ ok: true, status: 'pending' });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ detail: 'Internal server error' });
    }
  }
);

// POST /api/auth/advisors (admin only)
router.post(
  '/advisors',
  authenticate,
  [
    body('firstName').isString().trim().notEmpty(),
    body('lastName').isString().trim().notEmpty(),
    body('loginName').isString().trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('department').isString().trim().notEmpty(),
    body('phoneNumber').isString().trim().notEmpty(),
    body('password').isString().notEmpty(),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({ detail: 'Forbidden' });
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ detail: 'Invalid advisor data' });
        return;
      }

      const payload: AdvisorCreateRequest = req.body;
      const exists = await User.findOne({ 
        $or: [
          { loginName: payload.loginName },
          { email: payload.email }
        ]
      });
      if (exists) {
        if (exists.loginName === payload.loginName) {
          res.status(409).json({ detail: 'Login name already exists' });
        } else {
          res.status(409).json({ detail: 'Email already exists' });
        }
        return;
      }

      const passwordHash = await hashPassword(payload.password);
      const advisor = await User.create({
        firstName: payload.firstName,
        lastName: payload.lastName,
        loginName: payload.loginName,
        email: payload.email,
        department: payload.department,
        role: 'advisor',
        status: 'active',
        phoneNumber: payload.phoneNumber,
        passwordHash,
        notificationPreferences: {
          email: true,
          push: true,
          urgent: true,
          eventReminders: true,
        },
      });

      res.status(201).json({ ok: true, advisor: { id: advisor.id, loginName: advisor.loginName } });
    } catch (error) {
      console.error('Advisor create error:', error);
      res.status(500).json({ detail: 'Internal server error' });
    }
  }
);

// GET /api/auth/advisors (admin only)
router.get('/advisors', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ detail: 'Forbidden' });
    return;
  }

  const advisors = await User.find({ role: 'advisor' }).select('-passwordHash');
  res.json({ advisors });
});

// GET /api/auth/advisors/public
router.get('/advisors/public', async (_req: Request, res: Response): Promise<void> => {
  const advisors = await User.find({ role: 'advisor' })
    .select('firstName lastName loginName department')
    .sort({ lastName: 1, firstName: 1 });
  res.json({ advisors });
});

// GET /api/auth/advisor/pending (advisor only)
router.get('/advisor/pending', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user || req.user.role !== 'advisor') {
    res.status(403).json({ detail: 'Forbidden' });
    return;
  }

  const advisorName = `${req.user.firstName} ${req.user.lastName}`.trim();
  const students = await User.find({
    role: 'student',
    status: 'pending',
    $or: [
      { advisorLoginName: req.user.loginName },
      { advisorName },
      { advisorName: req.user.firstName },
      { advisorName: req.user.loginName },
    ],
  }).select('-passwordHash');
  res.json({ students });
});

// POST /api/auth/advisor/approve (advisor only)
router.post('/advisor/approve', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user || req.user.role !== 'advisor') {
    res.status(403).json({ detail: 'Forbidden' });
    return;
  }

  const { studentId } = req.body as { studentId?: string };
  if (!studentId) {
    res.status(400).json({ detail: 'studentId required' });
    return;
  }

  const advisorName = `${req.user.firstName} ${req.user.lastName}`.trim();
  const student = await User.findOne({
    _id: studentId,
    role: 'student',
    $or: [
      { advisorLoginName: req.user.loginName },
      { advisorName },
      { advisorName: req.user.firstName },
      { advisorName: req.user.loginName },
    ],
  });
  if (!student) {
    res.status(404).json({ detail: 'Student not found' });
    return;
  }

  student.status = 'approved';
  await student.save();
  res.json({ ok: true });
});

// POST /api/auth/logout
router.post('/logout', (req: Request, res: Response): void => {
  res.clearCookie('alerthub_access', { path: '/' });
  res.json({ ok: true });
});

// GET /api/auth/me
router.get('/me', authenticate, (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ detail: 'Not authenticated' });
    return;
  }

  const response: MeResponse = {
    id: req.user._id?.toString() || '',
    role: req.user.role,
    loginName: req.user.loginName,
    status: req.user.status,
    advisorLoginName: req.user.advisorLoginName,
    advisorName: req.user.advisorName,
  };

  res.json(response);
});

export default router;
