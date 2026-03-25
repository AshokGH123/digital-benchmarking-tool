# Start MongoDB - Quick Fix

## Option 1: Run the Batch File (EASIEST)

1. Double-click `start-mongodb.bat` in the project root
2. A command window will open showing MongoDB running
3. **Keep this window open** while using the app
4. In a new terminal, start backend: `cd backend && npm start`

## Option 2: Enable MongoDB Service

Run as Administrator:
```cmd
sc config MongoDB start=demand
net start MongoDB
```

## Option 3: Manual Start

Open Command Prompt and run:
```cmd
mkdir C:\data\db
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
```

Keep this terminal open.

## Verify MongoDB is Running

Open new terminal:
```cmd
"C:\Program Files\MongoDB\Server\7.0\bin\mongo.exe"
```

Should connect successfully.

## Then Start Your App

**Terminal 1:** MongoDB (keep running)
**Terminal 2:** Backend
```cmd
cd backend
npm start
```

**Terminal 3:** Frontend
```cmd
cd frontend
npm start
```

Now try registering at http://localhost:3000/register
