# Fix: DEPLOYMENT_NOT_FOUND Error on Vercel

## Problem
When creating a link on the deployed Vercel app, you get:
```
404: NOT_FOUND
Code: DEPLOYMENT_NOT_FOUND
```

Works locally but fails on Vercel.

## Root Cause
This error usually means:
1. **Database connection is failing** (most common)
2. **Prisma Client not generated** during build
3. **Environment variables not set** in Vercel
4. **Database migrations not run**

## Step-by-Step Fix

### Step 1: Check Vercel Environment Variables

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Click on your project: **tinylink-himanshu**
3. Go to **Settings** → **Environment Variables**
4. **VERIFY** these variables are set for **Production**, **Preview**, AND **Development**:

   ```
   DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
   BASE_URL=https://tinylink-himanshu.vercel.app
   NEXT_PUBLIC_BASE_URL=https://tinylink-himanshu.vercel.app
   ```

   ⚠️ **IMPORTANT**: 
   - Replace with your actual Neon PostgreSQL connection string
   - Make sure `DATABASE_URL` is set for **ALL environments** (Production, Preview, Development)
   - The URL should look like: `postgresql://user:pass@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require`

### Step 2: Run Database Migrations

Your database needs the schema. Run migrations:

**Option A: Using Vercel CLI (Recommended)**
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy
```

**Option B: Direct Connection**
```bash
# Set your production DATABASE_URL
set DATABASE_URL=your-neon-connection-string-here

# Run migrations
npx prisma migrate deploy
```

**Option C: Using Neon Console**
1. Go to https://console.neon.tech
2. Open your project
3. Go to SQL Editor
4. Copy the SQL from `prisma/migrations/20251122054307_init/migration.sql`
5. Paste and run it in the SQL Editor

### Step 3: Verify Build Logs

1. In Vercel Dashboard → Your Project → **Deployments**
2. Click on the latest deployment
3. Check **Build Logs** for:
   - ✅ `prisma generate` runs successfully
   - ✅ `next build` completes without errors
   - ❌ Look for any Prisma or database errors

**Common Build Errors:**
- `Prisma Client has not been generated` → Check `postinstall` script
- `Can't reach database server` → Check `DATABASE_URL`
- `Module not found: @prisma/client` → Prisma Client not generated

### Step 4: Test the Diagnostic Endpoint

I've added a new diagnostic endpoint. After redeploying, test it:

**Visit:** `https://tinylink-himanshu.vercel.app/api/health`

This will show you:
- ✅ If Prisma Client is initialized
- ✅ If DATABASE_URL is set
- ✅ If database connection works
- ❌ Any specific errors

**Expected Response (Success):**
```json
{
  "ok": true,
  "version": "1.0",
  "checks": {
    "database": "ok",
    "prismaClient": "ok",
    "databaseUrl": true
  },
  "errors": []
}
```

**Expected Response (Error):**
```json
{
  "ok": false,
  "checks": {
    "database": "error",
    "prismaClient": "ok",
    "databaseUrl": false
  },
  "errors": [
    "DATABASE_URL environment variable is not set"
  ]
}
```

### Step 5: Commit and Redeploy

After fixing environment variables and running migrations:

1. **Commit the code changes** I made:
   ```bash
   git add .
   git commit -m "Fix: Add better error handling and diagnostics for Vercel"
   git push
   ```

2. **Or manually trigger redeploy** in Vercel Dashboard:
   - Go to Deployments
   - Click "..." on latest deployment
   - Click "Redeploy"

### Step 6: Test Again

1. Visit: `https://tinylink-himanshu.vercel.app`
2. Click "Add Link"
3. Enter a URL and create a link
4. Should work now! ✅

## What I Fixed in the Code

1. **Better Error Handling** in `app/api/links/route.ts`:
   - Detects Prisma Client initialization errors
   - Detects database connection errors
   - Returns proper error messages instead of crashing

2. **Improved Prisma Client** in `lib/prisma.ts`:
   - Checks if DATABASE_URL is set
   - Tests connection in production
   - Better error logging

3. **New Diagnostic Endpoint** at `/api/health`:
   - Tests database connection
   - Shows what's wrong
   - Helps debug issues

## Quick Checklist

- [ ] `DATABASE_URL` is set in Vercel (all environments)
- [ ] `BASE_URL` is set in Vercel
- [ ] `NEXT_PUBLIC_BASE_URL` is set in Vercel
- [ ] Database migrations are run (`prisma migrate deploy`)
- [ ] Build succeeds in Vercel (check build logs)
- [ ] `/api/health` endpoint shows all checks passing
- [ ] Code changes are committed and pushed
- [ ] New deployment is triggered

## Still Not Working?

1. **Check Vercel Function Logs**:
   - Dashboard → Your Project → **Logs** tab
   - Look for errors when creating a link
   - Share the error message

2. **Test the Health Endpoint**:
   - Visit: `https://tinylink-himanshu.vercel.app/api/health`
   - Share the response

3. **Verify Database Connection**:
   - Try connecting to your Neon database from a local tool
   - Make sure the connection string is correct

4. **Check Vercel Build Logs**:
   - Look for any Prisma-related errors
   - Make sure `prisma generate` runs successfully

## Most Common Issue

**90% of the time, it's missing `DATABASE_URL` in Vercel environment variables.**

Make sure:
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add `DATABASE_URL` with your Neon connection string
3. Select **Production**, **Preview**, AND **Development**
4. Click **Save**
5. **Redeploy** your project

After this, it should work! 🎉

