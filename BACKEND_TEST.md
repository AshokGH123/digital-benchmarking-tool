# Backend Connectivity Test

Open your browser console (F12) and run this to test the backend:

```javascript
// Test 1: Check if backend is running
fetch('http://localhost:5000/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend is running:', d))
  .catch(e => console.error('❌ Backend not reachable:', e));

// Test 2: Try registration
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@test.com',
    password: 'test123',
    company: 'Test Co',
    industry: 'Technology'
  })
})
  .then(r => r.json())
  .then(d => console.log('Registration response:', d))
  .catch(e => console.error('Registration error:', e));
```

## Quick Checks:

1. **Is backend running?**
   ```bash
   cd backend
   npm run dev
   ```
   Should see: "Server running in development mode on port 5000"

2. **Is MongoDB running?**
   ```bash
   # Windows
   net start MongoDB
   
   # Mac
   brew services start mongodb-community
   ```

3. **Check browser console** (F12) when you try to register
   - Look for red errors
   - Check Network tab for failed requests

4. **Test backend directly:**
   ```bash
   curl http://localhost:5000/health
   ```

## Common Issues:

- **CORS Error**: Backend .env needs `CORS_ORIGIN=http://localhost:3000`
- **Network Error**: Backend not running on port 5000
- **MongoDB Error**: MongoDB service not started
- **Port in use**: Another app using port 5000 or 3000
