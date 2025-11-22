# Fix for Catch-All Route DEPLOYMENT_NOT_FOUND on Vercel

## Problem
The catch-all route `/[code]` returns `404: DEPLOYMENT_NOT_FOUND` on Vercel even though:
- Build succeeds ✅
- Route is marked as dynamic (λ) ✅
- Works perfectly locally ✅

## Root Cause
Vercel's serverless function routing may not properly recognize catch-all dynamic routes at the root level in Next.js 14.0.4, especially when they're the only catch-all route.

## Solutions Applied

### 1. Enhanced Route Segment Configuration
Added to `app/[code]/route.ts`:
```typescript
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const runtime = 'nodejs'
export const fetchCache = 'force-no-store'
```

### 2. Function Configuration in vercel.json
Added explicit function configuration:
```json
{
  "functions": {
    "app/[code]/route.ts": {
      "maxDuration": 10
    }
  }
}
```

### 3. Next.js Config Updates
Added experimental config to ensure proper handling.

## Alternative Solutions to Try

If the issue persists, try these approaches:

### Option 1: Move Route to API Folder
If the catch-all route continues to fail, consider moving it:
- From: `app/[code]/route.ts`
- To: `app/api/redirect/[code]/route.ts`
- Then use: `https://tinylink-himanshu.vercel.app/api/redirect/1zLZYHW`

**Not recommended** as it changes the URL structure.

### Option 2: Use Middleware for Redirects
Create `middleware.ts` at root:
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip if it's an API route, static file, or known routes
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/code') ||
    pathname.startsWith('/_next') ||
    pathname === '/' ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // This is a short code - handle redirect
  const code = pathname.slice(1) // Remove leading /
  
  try {
    const { prisma } = await import('@/lib/prisma')
    const link = await prisma.link.findUnique({
      where: { code },
    })

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    // Update clicks
    await prisma.link.update({
      where: { code },
      data: {
        clicks: { increment: 1 },
        lastClicked: new Date(),
      },
    })

    return NextResponse.redirect(link.url, { status: 302 })
  } catch (error) {
    console.error('Middleware redirect error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - code (stats pages)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|code).*)',
  ],
}
```

### Option 3: Check Vercel Project Settings
1. Go to Vercel Dashboard → Your Project → Settings → General
2. Ensure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (or empty)
   - **Build Command:** `npm run build` (or empty for auto-detect)
   - **Output Directory:** `.next` (or empty for auto-detect)

### Option 4: Verify Deployment Region
The error ID shows `bom1::` which suggests the deployment might be in a different region. Check:
- Vercel Dashboard → Settings → General → Region
- Ensure it matches your database region for better performance

## Debugging Steps

1. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard → Your Project → Logs
   - Try accessing a short link
   - Look for any errors in the logs

2. **Test Health Check First:**
   - Visit: `https://tinylink-himanshu.vercel.app/healthz`
   - If this works, the issue is specific to the catch-all route
   - If this also fails, there's a broader deployment issue

3. **Check Build Output:**
   - In build logs, verify `λ /[code]` appears
   - The `λ` symbol means it's dynamic (correct)

4. **Verify Environment Variables:**
   - Ensure `DATABASE_URL` is set correctly
   - Database must be accessible from Vercel's servers

5. **Try Accessing via API Route:**
   - Test: `https://tinylink-himanshu.vercel.app/api/links`
   - If API routes work but catch-all doesn't, it's a routing issue

## Next Steps

1. **Commit and Push:**
   ```bash
   git add .
   git commit -m "Add explicit function config for catch-all route"
   git push
   ```

2. **Wait for Redeploy and Test**

3. **If Still Failing:**
   - Try the middleware approach (Option 2)
   - Or contact Vercel support with:
     - Deployment URL
     - Build logs
     - Function logs
     - Error ID from the 404 page

## Known Issues

- Next.js 14.0.4 has some known issues with catch-all routes on Vercel
- Consider upgrading to Next.js 14.1+ if the issue persists
- Vercel's routing system may need explicit configuration for root-level catch-all routes

