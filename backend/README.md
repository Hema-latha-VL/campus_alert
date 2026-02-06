# AlertHub Backend - Node.js + Express + MongoDB

This is the MERN stack backend for AlertHub, a centralized campus notice management platform.

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **TypeScript** - Type safety
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A strong secret key for JWT
- `CORS_ORIGINS`: Allowed frontend origins

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication

#### POST /api/auth/login
Login with role and identity.

**Request:**
```json
{
  "role": "student|admin|super_admin",
  "identity": "user@demo.local"
}
```

**Response:**
```json
{
  "access_token": "jwt_token",
  "token_type": "bearer",
  "role": "student",
  "identity": "user@demo.local"
}
```

#### POST /api/auth/logout
Logout and clear cookies.

#### GET /api/auth/me
Get current user info (requires authentication).

**Response:**
```json
{
  "role": "student",
  "identity": "user@demo.local"
}
```

## Database Schema

### User Model
```typescript
{
  identity: string;      // Unique user identifier
  role: string;          // student | admin | super_admin
  createdAt: Date;       // Auto-generated timestamp
}
```

## Demo Users

The server automatically seeds demo users on startup:
- `student@demo.local` (role: student)
- `admin@demo.local` (role: admin)
- `super_admin@demo.local` (role: super_admin)

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production server
- `npm run lint` - Run ESLint
- `npm run seed` - Manually seed demo users

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── index.ts     # Main config
│   │   └── database.ts  # MongoDB connection
│   ├── middleware/      # Express middleware
│   │   └── auth.ts      # Authentication middleware
│   ├── models/          # Mongoose models
│   │   └── User.ts      # User model
│   ├── routes/          # API routes
│   │   ├── index.ts     # Route aggregator
│   │   └── auth.ts      # Auth routes
│   ├── scripts/         # Utility scripts
│   │   └── seed.ts      # Database seeding
│   ├── utils/           # Utility functions
│   │   └── security.ts  # JWT & password utils
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── .env                 # Environment variables
├── .env.example         # Example env file
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript config
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/alerthub |
| JWT_SECRET | Secret for JWT signing | CHANGE_ME_DEV_ONLY |
| JWT_EXPIRES_IN | JWT expiration time | 24h |
| CORS_ORIGINS | Allowed CORS origins | http://localhost:8080 |
| COOKIE_SECURE | Use secure cookies | false |

## Security Features

- HTTP-only cookies for JWT tokens
- CORS protection
- Helmet.js security headers
- JWT token expiration
- Role-based access control

## MongoDB Setup

### Local MongoDB
Install MongoDB locally or use Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### MongoDB Atlas (Cloud)
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update `MONGODB_URI` in `.env`

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify network access (for MongoDB Atlas)

### Port Already in Use
Change the `PORT` in `.env` to another available port.

### CORS Errors
Add your frontend URL to `CORS_ORIGINS` in `.env`.

## Next Steps

To extend this backend:
1. Add Notice model and routes
2. Implement categories and tags
3. Add notification system
4. Implement file uploads
5. Add search and filtering
6. Create analytics endpoints

## License

MIT
