# Deployment Guide

## Prerequisites
1. GitHub account
2. MongoDB Atlas account (free tier)
3. Vercel account (free)
4. Render account (free)

## Step 1: Setup MongoDB Atlas (Database)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Database Access → Add user (username/password)
4. Network Access → Add IP: 0.0.0.0/0 (allow all)
5. Connect → Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/digital-benchmarking`

## Step 2: Push to GitHub
```bash
cd c:\benchmarktool
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/benchmarktool.git
git push -u origin main
```

## Step 3: Deploy Backend on Render
1. Go to https://render.com → Sign up with GitHub
2. New → Web Service
3. Connect repository: benchmarktool
4. Settings:
   - Name: benchmarktool-backend
   - Root Directory: backend
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/digital-benchmarking
   JWT_SECRET=your_jwt_secret_key_change_this
   JWT_EXPIRE=7d
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=predict.smartstock@gmail.com
   SMTP_PASS=SMTP_PASS=your_email_app_password_here
   ```
6. Click "Create Web Service"
7. Copy your backend URL: `https://benchmarktool-backend.onrender.com`

## Step 4: Update Google OAuth
1. Go to https://console.cloud.google.com/
2. APIs & Services → Credentials
3. Edit your OAuth Client ID
4. Add to Authorized JavaScript origins:
   - `https://your-frontend-url.vercel.app`
5. Add to Authorized redirect URIs:
   - `https://your-frontend-url.vercel.app`

## Step 5: Deploy Frontend on Vercel
1. Go to https://vercel.com → Sign up with GitHub
2. New Project → Import benchmarktool repository
3. Settings:
   - Framework Preset: Create React App
   - Root Directory: frontend
   - Build Command: `npm run build`
   - Output Directory: build
4. Add Environment Variable:
   - Name: `REACT_APP_API_URL`
   - Value: `https://benchmarktool-backend.onrender.com/api`
5. Click "Deploy"
6. Copy your frontend URL: `https://benchmarktool.vercel.app`

## Step 6: Update Backend CORS
1. Go back to Render dashboard
2. Environment → Edit `CORS_ORIGIN`
3. Change to: `https://benchmarktool.vercel.app`
4. Save → Redeploy

## Step 7: Test
1. Open `https://benchmarktool.vercel.app`
2. Try Google Sign-In
3. Create benchmarks
4. Test email reports

## Alternative: Deploy Both on Render
If you want both on same platform:
1. Deploy backend as Web Service (as above)
2. Deploy frontend as Static Site:
   - Root Directory: frontend
   - Build Command: `npm install && npm run build`
   - Publish Directory: build
   - Add Environment Variable: `REACT_APP_API_URL`

## Troubleshooting
- **CORS Error**: Update CORS_ORIGIN in backend env
- **API Not Found**: Check REACT_APP_API_URL in frontend
- **MongoDB Connection**: Verify connection string and IP whitelist
- **Google Sign-In**: Update authorized origins in Google Console
