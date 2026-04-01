# Deployment Guide: Render + Vercel

This project should be deployed like this:

- Backend on Render
- Frontend on Vercel
- Database on MongoDB Atlas

Follow the steps below in order.

## 1. Create the MongoDB Atlas database

1. Open `https://www.mongodb.com/cloud/atlas`
2. Sign in or create an account.
3. Create a free cluster.
4. Open `Database Access`.
5. Add a database user and save the username/password.
6. Open `Network Access`.
7. Add IP access for `0.0.0.0/0`.
8. Open your cluster and click `Connect`.
9. Choose `Drivers`.
10. Copy the connection string.
11. Replace the placeholder password with your real password.
12. Make sure the database name in the connection string is `digital-benchmarking`.

Use that value as:

```env
MONGODB_URI=mongodb+srv://username:password@cluster-url/digital-benchmarking?retryWrites=true&w=majority
```

Important:

- This code uses `MONGODB_URI`
- Do not use `MONGO_URI`

## 2. Push the code to GitHub

If the repo is not on GitHub yet, run:

```powershell
git init
git add .
git commit -m "Prepare deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

If it is already on GitHub, run:

```powershell
git add .
git commit -m "Add deployment configuration"
git push
```

## 3. Create the backend service on Render

This repo now includes `render.yaml`.

### Option A: Use the blueprint file

1. Open `https://render.com`
2. Sign in with GitHub.
3. Click `New +`
4. Click `Blueprint`
5. Select this repository
6. Render will detect `render.yaml`
7. Continue

### Option B: Create manually

1. Open `https://render.com`
2. Click `New +`
3. Click `Web Service`
4. Select the repository
5. Use these values:

- Name: `benchmarktool-backend`
- Root Directory: `backend`
- Environment: `Node`
- Build Command: `npm install`
- Start Command: `npm start`

## 4. Add backend environment variables on Render

In the Render backend service, add these variables:

```env
NODE_ENV=production
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=use-a-long-random-secret
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000,https://your-frontend-project.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_app_password
```

Notes:

- `CORS_ORIGIN` supports multiple values separated by commas.
- Keep `http://localhost:3000` for local development.
- `PORT` is not needed on Render.

## 5. Deploy the backend

1. Create the service if you have not already.
2. Wait for the deploy to finish.
3. Open:

```text
https://your-render-service.onrender.com/health
```

4. Confirm you see a healthy JSON response.
5. Save your backend API URL:

```text
https://your-render-service.onrender.com/api
```

## 6. Create the frontend project on Vercel

This repo now includes `frontend/vercel.json` so React routes like `/dashboard` work after refresh.

1. Open `https://vercel.com`
2. Sign in with GitHub.
3. Click `Add New...`
4. Click `Project`
5. Import this repository
6. Use these project settings:

- Framework Preset: `Create React App`
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `build`

## 7. Add frontend environment variables on Vercel

In the Vercel project settings, add:

```env
REACT_APP_API_URL=https://your-render-service.onrender.com/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

Notes:

- `REACT_APP_API_URL` must end with `/api`
- `REACT_APP_GOOGLE_CLIENT_ID` must match the Google client ID used in Render

## 8. Deploy the frontend

1. Click `Deploy`
2. Wait for Vercel to finish
3. Open the generated URL
4. Save that frontend URL

Example:

```text
https://your-frontend-project.vercel.app
```

## 9. Update Render CORS with the real Vercel URL

Go back to Render and set:

```env
CORS_ORIGIN=http://localhost:3000,https://your-frontend-project.vercel.app
```

If you later add a custom domain, append it too:

```env
CORS_ORIGIN=http://localhost:3000,https://your-frontend-project.vercel.app,https://yourdomain.com
```

Save the env value and redeploy the backend.

## 10. Configure Google Sign-In

1. Open `https://console.cloud.google.com`
2. Open your project
3. Go to `APIs & Services`
4. Open `Credentials`
5. Open your OAuth 2.0 Client ID
6. Under `Authorized JavaScript origins`, add:

- `http://localhost:3000`
- `https://your-frontend-project.vercel.app`

7. Save

Important:

- Use the same Google client ID in both `REACT_APP_GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_ID`

## 11. Redeploy after env changes

Whenever you change environment variables:

1. Redeploy the Render backend
2. Redeploy the Vercel frontend

## 12. Test the deployed app

Test in this order:

1. Open the Vercel URL
2. Confirm the login page loads
3. Register a user
4. Log in with email/password
5. Test Google Sign-In
6. Open the dashboard
7. Create a benchmark
8. Open reports, analytics, and settings
9. Test email functionality if SMTP is configured

## 13. Troubleshooting

### Network error from frontend

Check:

- `REACT_APP_API_URL` in Vercel
- backend `/health` endpoint works
- Render service is live

### CORS error

Check:

- `CORS_ORIGIN` in Render
- Vercel frontend URL is correct
- the backend was redeployed after the change

### MongoDB connection error

Check:

- `MONGODB_URI` is correct
- Atlas password is correct
- Atlas network access includes `0.0.0.0/0`

### Google Sign-In error

Check:

- `REACT_APP_GOOGLE_CLIENT_ID` in Vercel
- `GOOGLE_CLIENT_ID` in Render
- both values are exactly the same
- the Vercel URL is added in Google Cloud Console

### Vercel page refresh returns 404

Check:

- `frontend/vercel.json` is present
- Vercel root directory is `frontend`
- you redeployed after pushing changes

## 14. Deployment files added

- `render.yaml`
- `frontend/vercel.json`
- `backend/.env.example`
- `frontend/.env.example`

## 15. Local env examples

### `backend/.env`

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your-local-or-atlas-uri
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_app_password
```

### `frontend/.env`

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```
