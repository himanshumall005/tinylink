# Vercel Deployment Guide for TinyLink

This guide ensures your TinyLink project deploys correctly on Vercel with Prisma and Neon PostgreSQL.

## ✅ Configuration Files

### 1. `package.json` Updates

The build script has been updated to generate Prisma Client before building:

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

- `postinstall`: Runs automatically after `npm install` to generate Prisma Client
- `build`: Generates Prisma Client before Next.js build

### 2. `vercel.json`

Created to configure Vercel build settings:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### 3. Prisma Client Configuration

The Prisma client in `lib/prisma.ts` is configured for production with proper error handling.

## 🚀 Deployment Steps

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Ready for Vercel deployment"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

### Step 3: Add Environment Variables

In Vercel project settings → Environment Variables, add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | Your Neon PostgreSQL connection string | Production, Preview, Development |
| `BASE_URL` | Your Vercel deployment URL (e.g., `https://your-app.vercel.app`) | Production, Preview, Development |
| `NEXT_PUBLIC_BASE_URL` | Same as BASE_URL | Production, Preview, Development |

**Example DATABASE_URL:**
```
postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
```

### Step 4: Run Database Migrations

After first deployment, run migrations:

**Option A: Using Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel env pull .env.local
npx prisma migrate deploy
```

**Option B: Direct Connection**
```bash
# Set DATABASE_URL in your local environment
export DATABASE_URL="your-neon-connection-string"
# Or on Windows:
set DATABASE_URL=your-neon-connection-string

npx prisma migrate deploy
```

**Option C: Using Neon Console**
- Go to Neon Console → SQL Editor
- Run the migration SQL manually (found in `prisma/migrations/`)

### Step 5: Redeploy

After running migrations, trigger a new deployment in Vercel (or push a new commit).

## 🔧 Build Process

Vercel will automatically:

1. **Install dependencies**: `npm install`
   - This triggers `postinstall` script → `prisma generate`

2. **Build application**: `npm run build`
   - This runs `prisma generate && next build`
   - Ensures Prisma Client is generated before Next.js build

3. **Deploy**: Vercel deploys the `.next` output

## ✅ Verification Checklist

After deployment, verify:

- [ ] `/healthz` returns `{"ok": true, "version": "1.0"}`
- [ ] Dashboard loads at `/`
- [ ] Can create a new link via UI
- [ ] Can create a link via API: `POST /api/links`
- [ ] Redirect works: `GET /:code` → 302 redirect
- [ ] Stats page loads: `GET /code/:code`
- [ ] Database connection works (no Prisma errors)

## 🐛 Troubleshooting

### Issue: "Prisma Client not generated"

**Solution:**
- Check that `postinstall` script exists in `package.json`
- Verify `prisma generate` runs in build logs
- Ensure Prisma is in `devDependencies` (it should be)

### Issue: "DATABASE_URL not found"

**Solution:**
- Verify environment variable is set in Vercel dashboard
- Check it's available for all environments (Production, Preview, Development)
- Redeploy after adding environment variables

### Issue: "Migration not applied"

**Solution:**
- Run `npx prisma migrate deploy` manually
- Or use Neon Console SQL Editor to run migration SQL

### Issue: "Prisma Client caching error"

**Solution:**
- The `postinstall` script ensures fresh generation
- Clear Vercel build cache if needed (Project Settings → General → Clear Build Cache)

### Issue: Build fails with Prisma errors

**Solution:**
1. Check build logs in Vercel dashboard
2. Ensure `prisma` is in `devDependencies`
3. Verify `DATABASE_URL` is set (even if migrations aren't run yet)
4. Check that `prisma/schema.prisma` is correct

## 📝 Environment Variables Template

Create these in Vercel:

```
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
BASE_URL=https://your-app.vercel.app
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

## 🔗 Useful Commands

```bash
# Test build locally
npm run build

# Check Prisma Client generation
npx prisma generate

# Verify environment variables (local)
echo $DATABASE_URL  # Linux/Mac
echo %DATABASE_URL%  # Windows

# Run migrations
npx prisma migrate deploy
```

## 📚 Additional Resources

- [Vercel Next.js Documentation](https://vercel.com/docs/frameworks/nextjs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Neon PostgreSQL](https://neon.tech)

## ✅ Final Checklist

Before submitting:

- [ ] Code pushed to GitHub
- [ ] Vercel project created and connected
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Application deployed successfully
- [ ] All routes tested and working
- [ ] Health check endpoint verified

---

**Your project is now configured for Vercel deployment!** 🚀

