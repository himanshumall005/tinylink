# Vercel Deployment Troubleshooting - DEPLOYMENT_NOT_FOUND Error

## Problem
Getting `404: NOT_FOUND` with `Code: DEPLOYMENT_NOT_FOUND` when accessing routes like:
- `https://tinylink-himanshu.vercel.app/healthz`
- `https://tinylink-himanshu.vercel.app/api/links/1zLZYHW`

Works locally but fails on Vercel.

## Solutions

### 1. Check Vercel Dashboard - Build Status

**Most Important:** Go to your Vercel dashboard and check if the deployment actually succeeded.

1. Go to https://vercel.com/dashboard
2. Click on your project `tinylink-himanshu`
3. Check the "Deployments" tab
4. Look at the latest deployment:
   - ✅ **Green checkmark** = Build succeeded
   - ❌ **Red X** = Build failed (this is likely your issue!)

**If build failed:**
- Click on the failed deployment
- Check the build logs
- Look for errors like:
  - Prisma Client generation errors
  - Database connection errors
  - Missing environment variables
  - TypeScript errors

### 2. Verify Environment Variables

The build might be failing because `DATABASE_URL` is missing.

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Ensure these are set for **Production**, **Preview**, AND **Development**:
   ```
   DATABASE_URL=postgresql://...
   BASE_URL=https://tinylink-himanshu.vercel.app
   NEXT_PUBLIC_BASE_URL=https://tinylink-himanshu.vercel.app
   ```
3. **Redeploy** after adding/changing environment variables

### 3. Check Build Logs for Prisma Errors

Common issues:
- Prisma Client not generating
- Database connection failing during build
- Missing Prisma schema

**Solution:** The `postinstall` script should handle this, but verify in build logs.

### 4. Verify the Deployment URL

Make sure you're using the correct URL:
- Check Vercel dashboard for the exact deployment URL
- It might be: `https://tinylink-himanshu-xxx.vercel.app` (with a hash)
- Or a custom domain if configured

### 5. Force a New Deployment

1. In Vercel dashboard → Deployments
2. Click "Redeploy" on the latest deployment
3. Or push a new commit to trigger a new build

### 6. Check if Routes Are Being Built

The error might mean routes aren't being recognized. Verify:

1. In Vercel build logs, look for:
   ```
   ✓ Compiled successfully
   ✓ Linting and checking validity of types
   ✓ Collecting page data
   ✓ Generating static pages
   ```

2. Check that these routes are listed:
   - `/api/links`
   - `/api/links/[code]`
   - `/healthz`
   - `/[code]`

### 7. Database Connection During Build

If Prisma tries to connect during build and fails:

**Temporary fix:** Add to `next.config.js`:
```js
const nextConfig = {
  reactStrictMode: true,
  // Skip database connection during build
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@prisma/client')
    }
    return config
  },
}
```

### 8. Verify Git Repository Connection

1. Vercel Dashboard → Settings → Git
2. Ensure your repository is properly connected
3. Check that the correct branch is set for production

### 9. Check Vercel Project Settings

1. Settings → General
2. **Framework Preset:** Should be "Next.js"
3. **Root Directory:** Should be `./` (or leave empty)
4. **Build Command:** Should be `npm run build` (or leave empty for auto-detect)
5. **Output Directory:** Should be `.next` (or leave empty for auto-detect)

### 10. Common Build Failures

**Error: "Prisma Client has not been generated"**
- Solution: The `postinstall` script should fix this
- Verify `package.json` has: `"postinstall": "prisma generate"`

**Error: "Cannot find module '@prisma/client'"**
- Solution: Ensure Prisma is in `dependencies`, not `devDependencies`
- Run `npm install` locally and commit `package-lock.json`

**Error: "DATABASE_URL is not set"**
- Solution: Add `DATABASE_URL` in Vercel environment variables
- Must be set for Production, Preview, AND Development

## Quick Fix Checklist

- [ ] Check Vercel dashboard - is deployment successful?
- [ ] Check build logs for errors
- [ ] Verify `DATABASE_URL` is set in environment variables
- [ ] Verify `BASE_URL` and `NEXT_PUBLIC_BASE_URL` are set
- [ ] Redeploy after setting environment variables
- [ ] Check that `package.json` has `postinstall` script
- [ ] Verify Prisma Client is generating (check build logs)
- [ ] Try redeploying from Vercel dashboard
- [ ] Check if using correct deployment URL

## Still Not Working?

1. **Check Vercel Status Page:** https://www.vercel-status.com
2. **Check Vercel Logs:** Dashboard → Your Project → Logs tab
3. **Contact Vercel Support** with:
   - Deployment URL
   - Build log errors
   - Environment variable names (not values)

## Code Changes Made

I've updated the route handlers to be compatible with Next.js 14:
- `app/[code]/route.ts` - Updated params handling
- `app/api/links/[code]/route.ts` - Updated params handling

These changes ensure compatibility with both Next.js 14 and future versions.

