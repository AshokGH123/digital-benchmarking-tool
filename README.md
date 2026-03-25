# Digital Benchmarking Tool - Phase 3

A full-stack MERN web application for evaluating, comparing, and improving digital processes using benchmarking metrics.

## Live Demo
- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-backend.onrender.com/api

---

## Phase 3 Enhancements

### UI/UX
- Skeleton loaders on all data-fetching pages
- Fade-in animations on cards and content
- Hover lift effects on cards
- Toast notifications for all actions (success/error/loading)
- Responsive design across all screen sizes
- Pagination on Benchmark page (6 per page)
- Circular progress loader on form submit buttons

### Advanced Logic
- **Search**: Real-time search by industry or notes
- **Filtering**: Filter benchmarks by quarter and year
- **Pagination**: Client-side pagination with page controls
- **Sorting**: Sort benchmarks by date, industry
- **Backend pagination**: API supports page, limit, sortBy, order query params

### Third-Party Integrations
- **Google OAuth 2.0**: Sign in with Google on login page
- **Gmail SMTP**: Automatic email notifications via Nodemailer
- **MongoDB Atlas**: Cloud database for production
- **Recharts**: Interactive charts and visualizations

### Performance
- Efficient MongoDB queries with indexing
- Pagination reduces data load
- Lazy rendering with Fade transitions
- Skeleton loaders prevent layout shift

### Deployment
- Backend deployed on **Render**
- Frontend deployed on **Vercel**
- Database on **MongoDB Atlas**
- Environment variables secured

---

## Features
- JWT Authentication + Google Sign-In
- Benchmark CRUD with search, filter, pagination
- Process Health Monitoring with auto health score
- AI-Powered Insights and recommendations
- Email Reports (automatic + manual)
- Analytics with charts (line, bar, pie)
- Notification history
- Dark/Light theme toggle

---

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Material-UI v5, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | JWT, Google OAuth 2.0 |
| Email | Nodemailer (Gmail SMTP) |
| Deployment | Render + Vercel |

---

## Installation

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Environment Variables (backend/.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/digital-benchmarking
JWT_SECRET=your_secret
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

---

## API Documentation
See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for full API reference.

## Deployment Guide
See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step deployment instructions.

---

## Author
**Ashok** | MIT License
