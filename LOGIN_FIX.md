# Quick Start - Login Issue Fix

## Problem
You're getting "Invalid credentials" because there are no users in the database yet.

## Solution - Create a Test User

### Option 1: Use the Registration Page (Recommended)
1. Go to http://localhost:3000/register
2. Fill in the form:
   - Name: Your Name
   - Email: your@email.com
   - Password: yourpassword (min 6 characters)
   - Company: Your Company
   - Industry: Select from dropdown
3. Click "Sign Up"
4. You'll be automatically logged in!

### Option 2: Create Test User via Script
Run this command in the backend directory:
```bash
cd backend
node createTestUser.js
```

This creates a test user:
- **Email**: test@example.com
- **Password**: test123

Then login with these credentials at http://localhost:3000/login

---

## Verify Backend is Running

Make sure your backend server is running:
```bash
cd backend
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: ...
```

---

## Verify MongoDB is Running

### Windows:
```bash
net start MongoDB
```

### macOS/Linux:
```bash
sudo systemctl start mongod
# or
brew services start mongodb-community
```

---

## Test the API Directly

You can test if the backend is working using curl or Postman:

### Register a user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "company": "Acme Corp",
    "industry": "Technology"
  }'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

## Common Issues

### 1. Backend not running
**Error**: Network Error or ERR_CONNECTION_REFUSED
**Fix**: Start backend with `npm run dev` in backend folder

### 2. MongoDB not running
**Error**: MongooseServerSelectionError
**Fix**: Start MongoDB service

### 3. Wrong credentials
**Error**: Invalid credentials
**Fix**: Make sure you registered first, or use the test user credentials

### 4. CORS error
**Error**: CORS policy blocked
**Fix**: Check backend .env has `CORS_ORIGIN=http://localhost:3000`

---

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/benchmarking-tool
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Success!

Once you register or create a test user, you can:
1. Login at http://localhost:3000/login
2. Access the dashboard
3. Create benchmarks
4. View analytics

**Default Test User:**
- Email: test@example.com
- Password: test123
