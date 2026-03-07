# MERN Stack Setup Guide

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/benchmarking-tool
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### 4. Start Backend Server
```bash
npm run dev
```

Backend will run on http://localhost:5000

---

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start Frontend Server
```bash
npm start
```

Frontend will run on http://localhost:3000

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Benchmarks
- `GET /api/benchmarks` - Get all user benchmarks (Protected)
- `POST /api/benchmarks` - Create benchmark (Protected)
- `GET /api/benchmarks/:id` - Get single benchmark (Protected)
- `PUT /api/benchmarks/:id` - Update benchmark (Protected)
- `DELETE /api/benchmarks/:id` - Delete benchmark (Protected)
- `GET /api/benchmarks/industry/:industry` - Get industry benchmarks (Protected)

### Dashboard
- `GET /api/dashboard` - Get dashboard data (Protected)
- `GET /api/dashboard/analytics` - Get analytics data (Protected)

---

## Testing the Application

### 1. Register a New User
- Navigate to http://localhost:3000/register
- Fill in the registration form
- Submit to create account

### 2. Login
- Navigate to http://localhost:3000/login
- Use your credentials
- You'll be redirected to the dashboard

### 3. Create Benchmark
- Navigate to Benchmark page
- Fill in metrics data
- Submit to save

---

## Project Structure

```
benchmarktool/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
│
└── frontend/
    ├── public/
    └── src/
        ├── components/  # React components
        ├── context/     # Context API
        ├── pages/       # Page components
        ├── services/    # API services
        └── App.js       # Main app component
```

---

## Security Features

✅ JWT Authentication
✅ Password Hashing (bcrypt)
✅ Protected Routes
✅ CORS Configuration
✅ Helmet Security Headers
✅ Rate Limiting
✅ Input Validation
✅ Error Handling

---

## Technologies Used

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- express-validator
- helmet
- cors

**Frontend:**
- React.js
- Material-UI v5
- Axios
- Context API
- React Router v6
- React Hot Toast

---

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Verify MongoDB port (default: 27017)

### CORS Error
- Check CORS_ORIGIN in backend .env
- Ensure frontend URL matches CORS_ORIGIN

### JWT Error
- Verify JWT_SECRET is set in backend .env
- Check token in localStorage
- Try logging out and logging in again

---

## Author
**Ashok**

## License
MIT
