# Setup Instructions - Connecting Frontend to Backend

## 📋 Prerequisites

1. Node.js and npm installed
2. MongoDB database running (or connection string configured)

## 🚀 Step-by-Step Setup

### 1. Backend Setup

#### Navigate to backend folder:
```bash
cd backend
```

#### Install backend dependencies:
```bash
npm install
```

#### Create `.env` file in backend folder:
```env
DB_URI=your_mongodb_connection_string
PORT=3000
JWT_SECRET=your_jwt_secret_key
```

Example MongoDB connection string:
```
mongodb://localhost:27017/wallet
```
or
```
mongodb+srv://username:password@cluster.mongodb.net/wallet
```

#### Start the backend server:
```bash
npm run dev
```

The backend should now be running on `http://localhost:3000`

### 2. Frontend Setup

#### Navigate to project root:
```bash
cd ..
```

#### Install frontend dependencies (if not already installed):
```bash
npm install
```

#### Start the frontend development server:
```bash
npm start
```
or
```bash
ng serve
```

The frontend should now be running on `http://localhost:4200`

## ✅ Verification

1. **Backend is running**: Check `http://localhost:3000` (should see connection message)
2. **Frontend is running**: Check `http://localhost:4200` (should see your Angular app)
3. **Test Income API**:
   - Login/Register first to get a JWT token
   - Navigate to the Income page
   - Try adding a new income source

## 🔧 Running Both Servers

### Option 1: Two Terminal Windows (Recommended for Development)
- Terminal 1: Run backend (`cd backend && npm run dev`)
- Terminal 2: Run frontend (`npm start`)

### Option 2: Use a Process Manager
You can use tools like `concurrently` or `npm-run-all` to run both:

```bash
npm install --save-dev concurrently
```

Then add to `package.json`:
```json
"scripts": {
  "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
  "dev:backend": "cd backend && npm run dev",
  "dev:frontend": "ng serve"
}
```

## 📝 Important Notes

1. **Authentication**: The backend requires JWT tokens. Make sure you:
   - Login or Register first
   - The token is stored in `localStorage` (handled by auth service)
   - Token is automatically sent with all API requests

2. **CORS**: The backend is configured with CORS to allow requests from `http://localhost:4200`

3. **User ID**: After login, the `userId` is stored in `SharedService` and used for all income operations

## 🐛 Troubleshooting

### Backend won't start:
- Check MongoDB connection string in `.env`
- Make sure MongoDB is running
- Check if port 3000 is already in use

### Frontend can't connect to backend:
- Verify backend is running on port 3000
- Check browser console for CORS errors
- Verify JWT token is stored in localStorage

### API calls failing:
- Check if JWT token exists: `localStorage.getItem('token')`
- Verify token is valid (not expired)
- Check backend logs for error messages
- Verify user is logged in

## 🔄 API Endpoints

The Income API endpoints are:
- `GET /incomes/:userId` - Get all incomes for a user
- `GET /incomes/single/:id` - Get single income
- `GET /incomes/total/:userId` - Get total income
- `POST /incomes` - Create new income
- `PUT /incomes/:id` - Update income
- `DELETE /incomes/:id` - Delete income

All endpoints require JWT authentication (Bearer token in Authorization header).
