# JWT_SECRET Setup Guide

## What is JWT_SECRET?

`JWT_SECRET` is a secret key used to sign and verify JWT (JSON Web Token) tokens. It's not something you retrieve from anywhere - **you create it yourself**. It should be:
- A random, secure string
- Kept secret (never commit to git)
- Long and complex (at least 32 characters recommended)

## 🔐 How to Generate a JWT_SECRET

### Option 1: Using Node.js (Recommended)

Run this command in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

This generates a secure 128-character hexadecimal string.

### Option 2: Using OpenSSL

```bash
openssl rand -hex 64
```

### Option 3: Online Generator

You can use an online random string generator, but be cautious:
- Only use it once
- Don't use it for production
- Examples: https://randomkeygen.com/

### Option 4: Manual Random String

You can create any long random string yourself, for example:
```
mySuperSecretJWTKeyForWalletApp2024!@#$%^&*()_+{}[]|:";'<>?,./
```

## 📝 Setting Up Your .env File

### Step 1: Create `.env` file in `backend` folder

If you don't have a `.env` file yet, create it:

```bash
cd backend
touch .env
```

### Step 2: Add your JWT_SECRET

Open the `.env` file and add:

```env
DB_URI=mongodb://localhost:27017/wallet
PORT=3000
JWT_SECRET=your_generated_secret_here
```

**Example:**
```env
DB_URI=mongodb://localhost:27017/wallet
PORT=3000
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2
```

### Step 3: Verify your backend can read it

Make sure your `backend/app.js` has:
```javascript
const dotenv = require("dotenv");
dotenv.config();
```

This loads the `.env` file at startup.

## ⚠️ Important Security Notes

1. **Never commit `.env` to git**
   - Make sure `.env` is in `.gitignore`
   - Never share your JWT_SECRET publicly

2. **Use different secrets for different environments**
   - Development: Can be simpler
   - Production: Must be complex and secure

3. **If you change JWT_SECRET**
   - All existing tokens become invalid
   - Users will need to log in again

## 🧪 Quick Test

After setting up your `.env` file, you can test if it's working:

```bash
cd backend
node -e "require('dotenv').config(); console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? 'YES' : 'NO');"
```

This should output: `JWT_SECRET loaded: YES`

## 📋 Complete .env Example

Here's a complete example `.env` file:

```env
# MongoDB Connection
DB_URI=mongodb://localhost:27017/wallet

# Server Port
PORT=3000

# JWT Secret Key (generate a new one using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=3f8a9b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6
```

## 🚀 Next Steps

1. Generate your JWT_SECRET using one of the methods above
2. Add it to `backend/.env` file
3. Restart your backend server
4. Test authentication (login/register)

Your JWT tokens will now be signed with this secret key!
