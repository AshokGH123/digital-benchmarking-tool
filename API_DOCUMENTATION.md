# Digital Benchmarking Tool - API Documentation

## Base URL
- **Local**: `http://localhost:5000/api`
- **Production**: `https://your-backend.onrender.com/api`

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### POST /auth/register
Register a new user.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "company": "Acme Corp",
  "industry": "Technology"
}
```
**Response:** `{ success, token, user }`

---

### POST /auth/login
Login with email and password.

**Body:**
```json
{ "email": "john@example.com", "password": "password123" }
```
**Response:** `{ success, token, user }`

---

### POST /auth/google
Login with Google OAuth credential.

**Body:**
```json
{ "credential": "<google_id_token>" }
```
**Response:** `{ success, token, user }`

---

### GET /auth/me *(Protected)*
Get current logged-in user.

**Response:** `{ success, user }`

---

### PUT /auth/profile *(Protected)*
Update user profile.

**Body:**
```json
{ "name": "New Name", "company": "New Company", "industry": "Finance" }
```

---

## Benchmark Endpoints

### GET /benchmarks *(Protected)*
Get all benchmarks with search, filter, and pagination.

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| search | string | Search by industry or notes |
| quarter | string | Filter by Q1/Q2/Q3/Q4 |
| year | number | Filter by year |
| industry | string | Filter by industry name |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
| sortBy | string | Field to sort by (default: createdAt) |
| order | string | asc or desc (default: desc) |

**Response:**
```json
{
  "success": true,
  "count": 6,
  "total": 20,
  "totalPages": 4,
  "currentPage": 1,
  "data": [...]
}
```

---

### POST /benchmarks *(Protected)*
Create a new benchmark.

**Body:**
```json
{
  "industry": "Technology",
  "quarter": "Q1",
  "year": 2024,
  "notes": "Optional notes",
  "metrics": {
    "websiteTraffic": 50000,
    "conversionRate": 3.5,
    "socialMediaEngagement": 1200,
    "customerSatisfaction": 85,
    "revenueGrowth": 12,
    "operationalEfficiency": 78
  }
}
```
**Response:** `{ success, data }` — Also triggers automatic email notification.

---

### GET /benchmarks/:id *(Protected)*
Get a single benchmark by ID.

---

### PUT /benchmarks/:id *(Protected)*
Update a benchmark.

---

### DELETE /benchmarks/:id *(Protected)*
Delete a benchmark.

---

### POST /benchmarks/send-report *(Protected)*
Send complete benchmark report to user's email.

**Response:** `{ success, message }`

---

### GET /benchmarks/industry/:industry *(Protected)*
Get industry benchmarks with averages.

**Query Params:** `quarter`, `year`

---

## Dashboard Endpoints

### GET /dashboard *(Protected)*
Get dashboard summary data.

**Response:**
```json
{
  "success": true,
  "data": {
    "userAverages": { "websiteTraffic": 0, "conversionRate": 0, ... },
    "industryAverages": { ... },
    "metricsTrend": [...],
    "latestBenchmark": { ... },
    "totalBenchmarks": 10
  }
}
```

---

## Process Health Endpoints

### GET /processes *(Protected)*
Get all processes.

### POST /processes *(Protected)*
Create a process. Auto-calculates health score and sends alert if score < 60%.

**Body:**
```json
{
  "processName": "Order Fulfillment",
  "benchmarkTime": 6,
  "actualTime": 8,
  "benchmarkCost": 5000,
  "actualCost": 6500,
  "errorRate": 5
}
```

### PUT /processes/:id *(Protected)*
Update a process.

### DELETE /processes/:id *(Protected)*
Delete a process.

---

## Notifications Endpoints

### GET /notifications *(Protected)*
Get email notification history.

### POST /notifications/send-weekly *(Protected)*
Trigger weekly report email.

### POST /notifications/resend/:id *(Protected)*
Resend a specific notification.

---

## Health Score Formula
```
healthScore = (benchmarkTime/actualTime * 100 + benchmarkCost/actualCost * 100 + (100 - errorRate)) / 3
```
- **Good**: > 80%
- **Moderate**: 60–80%
- **Poor**: < 60% (triggers automatic email alert)

---

## Error Responses
```json
{ "success": false, "error": "Error message here" }
```

| Status | Meaning |
|--------|---------|
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

---

## Tech Stack
- **Frontend**: React.js, Material-UI v5, Recharts, @react-oauth/google
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Auth**: JWT + Google OAuth 2.0
- **Email**: Nodemailer (Gmail SMTP)
- **Deployment**: Render (Backend), Vercel (Frontend), MongoDB Atlas (Database)
