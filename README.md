
# AlertHub - Campus Notice Management Platform

> 🚀 **Backend Successfully Converted to MERN Stack!** See [BACKEND_CONVERSION_COMPLETE.md](BACKEND_CONVERSION_COMPLETE.md) for details.

---

## 📚 Quick Links

- 📖 **[Documentation Index](DOCUMENTATION_INDEX.md)** - Navigate all documentation
- 🚀 **[Quick Start Guide](QUICKSTART.md)** - Get up and running fast
- 🗄️ **[MongoDB Setup](MONGODB_SETUP.md)** - Database installation
- 🔄 **[What Changed](WHAT_CHANGED.md)** - Migration summary
- 🏗️ **[Architecture](ARCHITECTURE.md)** - System design

---

## 🎯 Problem Statement

Campus notices related to exams, holidays, results, placements, and events are scattered across physical notice boards, department emails, college portals, and WhatsApp groups.

This fragmented communication causes students to:
- Miss important deadlines and updates
- Face confusion due to inconsistent information
- Repeatedly contact faculty for clarification
- Lose academic and extracurricular opportunities

**AlertHub** solves this by providing a centralized, searchable, and personalized notice platform.

## ✨ Key Features

- **Unified Notice Board**: All official notices in one verified platform
- **Category-Based Organization**: Exams, holidays, clubs, placements, results, etc.
- **Personalized Alerts**: Students subscribe to relevant categories
- **Real-Time Notifications**: Push notifications and email alerts
- **Searchable Archive**: Easily find past notices
- **Calendar Integration**: Export exams and events to personal calendars
- **Admin Verification**: Only approved notices are published
- **Upvotes & Priority**: Student engagement helps surface urgent announcements
- **Analytics Dashboard**: Track reach, views, and engagement

## 🛠 Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for fast builds
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation

### Backend (MERN Stack)
- **Node.js** runtime
- **Express.js** web framework
- **MongoDB** database
- **Mongoose** ODM
- **TypeScript** for type safety
- **JWT** for authentication
- **bcryptjs** for password hashing

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd campus-pulse-main
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# Update MONGODB_URI, JWT_SECRET, etc.

# Start MongoDB (if running locally)
# Or use MongoDB Atlas cloud database

# Run the backend server
npm run dev
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
# From project root
cd ..

# Install frontend dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173` (or the port Vite assigns)

### 4. Access the Application

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- Health Check: `http://localhost:5000/health`

### Demo Users

The backend automatically seeds demo users:
- **Student**: `student@demo.local`
- **Admin**: `admin@demo.local`
- **Super Admin**: `super_admin@demo.local`

## 📁 Project Structure

```
campus-pulse-main/
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── scripts/        # Utility scripts
│   │   ├── utils/          # Helper functions
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Server entry point
│   ├── .env                # Environment variables
│   ├── package.json        # Backend dependencies
│   └── tsconfig.json       # TypeScript config
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── lib/                # Utilities & API client
│   ├── hooks/              # Custom hooks
│   └── state/              # State management
├── public/                 # Static assets
└── package.json            # Frontend dependencies
```

## 🔧 Configuration

### Backend Environment Variables

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/alerthub
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRES_IN=24h
CORS_ORIGINS=http://localhost:5173,http://localhost:8080
COOKIE_SECURE=false
```

### Frontend Environment Variables

Create `.env.local` in the project root if needed:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/login` - Login with role and identity
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user info

For detailed API documentation, see [backend/README.md](backend/README.md)

## 🗄️ MongoDB Setup

### Option 1: Local MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or install MongoDB locally
# https://www.mongodb.com/docs/manual/installation/
```

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `backend/.env`

## 🧪 Development Scripts

### Backend

```bash
cd backend
npm run dev      # Start dev server with auto-reload
npm run build    # Build for production
npm start        # Run production server
npm run lint     # Run ESLint
npm run seed     # Seed demo users
```

### Frontend

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run linter
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `backend/.env`
- Verify network access (for MongoDB Atlas)

### Port Already in Use
- Change `PORT` in `backend/.env` to another available port
- Update `VITE_API_BASE_URL` accordingly

### CORS Errors
- Add your frontend URL to `CORS_ORIGINS` in `backend/.env`
- Ensure credentials are included in API requests

## 📚 Next Steps

To extend this project:

1. **Notice Management**
   - Add Notice model and CRUD operations
   - Implement file uploads for attachments
   - Add rich text editor support

2. **Categories & Tags**
   - Create category management
   - Implement tag system
   - Add filtering and search

3. **Notifications**
   - Email notifications
   - Push notifications
   - SMS alerts

4. **User Profiles**
   - Student preferences
   - Subscription management
   - Notification settings

5. **Analytics**
   - View tracking
   - Engagement metrics
   - Department dashboards

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

## 🔗 Links

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + MongoDB
- UI Components: shadcn/ui
- Styling: Tailwind CSS

---

**Built with ❤️ for better campus communication**

>>>>>>> a9abd1e (Initial commit)
