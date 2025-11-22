# TinyLink - URL Shortener

**Assignment reference: uploaded PDF**

A production-ready URL shortener application (bit.ly clone) built with Next.js, TypeScript, Tailwind CSS, Prisma ORM, and PostgreSQL (Neon).

## Features

- ✅ Create short links with auto-generated or custom codes (6-8 alphanumeric characters)
- ✅ Dashboard with search, filter, and management capabilities
- ✅ Detailed statistics page for each link
- ✅ Click tracking and analytics
- ✅ Copy-to-clipboard functionality
- ✅ Responsive, accessible UI with keyboard navigation
- ✅ Form validation and error handling
- ✅ Health check endpoint

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Validation**: Zod

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database (Neon recommended)
- Git

## Local Development Setup

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp env.example .env
```

Edit `.env` and add your database connection string:

```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
BASE_URL="http://localhost:3000"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run db:generate

# Run database migrations
npm run db:migrate
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database (dev only)
- `npm run db:studio` - Open Prisma Studio

## API Endpoints

### POST /api/links
Create a new short link.

**Request:**
```json
{
  "url": "https://example.com",
  "code": "custom1" // optional
}
```

**Response (201):**
```json
{
  "id": "clx...",
  "code": "custom1",
  "url": "https://example.com",
  "clicks": 0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastClicked": null
}
```

**Error (409):** Code already exists
**Error (400):** Invalid URL or code format

### GET /api/links
List all links.

**Response (200):**
```json
[
  {
    "id": "clx...",
    "code": "abc123",
    "url": "https://example.com",
    "clicks": 5,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastClicked": "2024-01-02T00:00:00.000Z"
  }
]
```

### GET /api/links/:code
Get stats for a specific link.

**Response (200):**
```json
{
  "id": "clx...",
  "code": "abc123",
  "url": "https://example.com",
  "clicks": 5,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastClicked": "2024-01-02T00:00:00.000Z"
}
```

**Error (404):** Link not found

### DELETE /api/links/:code
Delete a link.

**Response (200):**
```json
{
  "message": "Link deleted successfully"
}
```

**Error (404):** Link not found

### GET /healthz
Health check endpoint.

**Response (200):**
```json
{
  "ok": true,
  "version": "1.0"
}
```

## Routes

- `GET /` - Dashboard page (list, add, delete links)
- `GET /code/:code` - Statistics page for a specific link
- `GET /:code` - Redirect to original URL (302) or 404 if deleted
- `GET /healthz` - Health check

## Shortcode Rules

- Must match regex: `[A-Za-z0-9]{6,8}`
- Must be unique across all users
- Auto-generated if not provided
- Returns 409 if custom code already exists

## Deployment to Vercel

### 1. Prepare Your Repository

Ensure all files are committed and pushed to GitHub/GitLab/Bitbucket.

### 2. Set Up Neon Database

1. Create an account at [Neon](https://neon.tech)
2. Create a new project
3. Copy your connection string (it will look like: `postgresql://user:password@host/database?sslmode=require`)

### 3. Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "New Project"
3. Import your repository
4. Configure environment variables:
   - `DATABASE_URL` - Your Neon PostgreSQL connection string
   - `BASE_URL` - Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
   - `NEXT_PUBLIC_BASE_URL` - Same as BASE_URL
5. Click "Deploy"

### 4. Run Database Migrations

After deployment, you need to run migrations. You can do this via:

**Option A: Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel env pull .env.local
npx prisma migrate deploy
```

**Option B: Direct Database Connection**
```bash
# Use your local environment with production DATABASE_URL
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

### 5. Generate Prisma Client (if needed)

Vercel should handle this automatically during build, but if you encounter issues:

```bash
# In your local environment
npx prisma generate
```

## Environment Variables for Production

In Vercel dashboard, set:

- `DATABASE_URL` - PostgreSQL connection string from Neon
- `BASE_URL` - Your production URL
- `NEXT_PUBLIC_BASE_URL` - Your production URL (for client-side)

## Testing

### Manual Testing

1. Create a link via the dashboard
2. Test redirect by visiting `/:code`
3. Verify click count increments
4. Check stats page shows correct data
5. Test deletion and verify 404 after deletion
6. Test duplicate code creation (should return 409)

### cURL Examples

See `CURL_EXAMPLES.md` for detailed API testing examples.

## Project Structure

```
tinylink/
├── app/
│   ├── api/
│   │   ├── links/
│   │   │   ├── [code]/
│   │   │   │   └── route.ts      # GET/DELETE /api/links/:code
│   │   │   └── route.ts          # POST/GET /api/links
│   ├── code/
│   │   └── [code]/
│   │       └── page.tsx          # Stats page
│   ├── [code]/
│   │   └── route.ts              # Redirect handler
│   ├── healthz/
│   │   └── route.ts              # Health check
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Dashboard
│   └── globals.css               # Global styles
├── lib/
│   ├── prisma.ts                 # Prisma client
│   ├── utils.ts                  # Utility functions
│   └── validations.ts            # Zod schemas
├── prisma/
│   └── schema.prisma             # Database schema
├── .env.example                  # Environment variables template
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## Code Quality

- TypeScript for type safety
- Zod for runtime validation
- Modular component structure
- Proper error handling
- Accessible UI (ARIA labels, keyboard navigation)
- Responsive design

## License

MIT

## Support

For issues or questions, please refer to the assignment specification or contact your instructor.

