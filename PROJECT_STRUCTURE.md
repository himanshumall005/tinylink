# TinyLink Project Structure

**Assignment reference: uploaded PDF**

This document lists all files created for the TinyLink application.

## Complete File Tree

```
TinyProject/
├── .eslintrc.json                 # ESLint configuration
├── .gitignore                     # Git ignore rules
├── CURL_EXAMPLES.md              # API testing examples with cURL
├── README.md                      # Main documentation
├── VIDEO_SCRIPT.md               # 2-3 minute video walkthrough script
├── PROJECT_STRUCTURE.md           # This file
├── env.example                    # Environment variables template
├── next.config.js                # Next.js configuration
├── package.json                   # Dependencies and scripts
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
│
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── links/
│   │   │   ├── [code]/
│   │   │   │   └── route.ts      # GET/DELETE /api/links/:code
│   │   │   └── route.ts          # POST/GET /api/links
│   ├── code/
│   │   └── [code]/
│   │       └── page.tsx          # Stats page (/code/:code)
│   ├── [code]/
│   │   └── route.ts              # Redirect handler (/:code)
│   ├── healthz/
│   │   └── route.ts              # Health check (/healthz)
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with header/footer
│   └── page.tsx                  # Dashboard page (/)
│
├── lib/                          # Utility libraries
│   ├── prisma.ts                 # Prisma client singleton
│   ├── utils.ts                  # Utility functions (validation, formatting)
│   └── validations.ts            # Zod schemas
│
└── prisma/
    └── schema.prisma             # Database schema (Link model)
```

## File Descriptions

### Configuration Files

- **package.json**: All dependencies (Next.js, Prisma, Tailwind, Zod, etc.) and npm scripts
- **tsconfig.json**: TypeScript compiler configuration
- **next.config.js**: Next.js framework configuration
- **tailwind.config.js**: Tailwind CSS theme and content paths
- **postcss.config.js**: PostCSS plugins for Tailwind
- **.eslintrc.json**: ESLint rules for Next.js
- **.gitignore**: Files to exclude from version control
- **env.example**: Template for environment variables

### API Routes (app/api/)

- **app/api/links/route.ts**: 
  - `POST /api/links` - Create new link
  - `GET /api/links` - List all links

- **app/api/links/[code]/route.ts**:
  - `GET /api/links/:code` - Get link stats
  - `DELETE /api/links/:code` - Delete link

### Page Routes (app/)

- **app/page.tsx**: Dashboard page with table, search, add/delete functionality
- **app/code/[code]/page.tsx**: Statistics page for individual links
- **app/[code]/route.ts**: Redirect handler (302) or 404
- **app/healthz/route.ts**: Health check endpoint
- **app/layout.tsx**: Root layout with header and footer
- **app/globals.css**: Global CSS with Tailwind directives

### Library Files (lib/)

- **lib/prisma.ts**: Prisma client instance (singleton pattern)
- **lib/utils.ts**: 
  - `isValidShortcode()` - Validates 6-8 alphanumeric characters
  - `generateShortcode()` - Generates random codes
  - `formatDate()` - Human-friendly timestamps
  - `truncateUrl()` - URL truncation with ellipsis
  - `cn()` - Tailwind class name utility

- **lib/validations.ts**: Zod schemas for API validation

### Database (prisma/)

- **prisma/schema.prisma**: Prisma schema defining the Link model

### Documentation

- **README.md**: Complete setup, deployment, and usage guide
- **CURL_EXAMPLES.md**: Detailed cURL examples for all API endpoints
- **VIDEO_SCRIPT.md**: 2-3 minute video walkthrough script
- **PROJECT_STRUCTURE.md**: This file

## Key Features Implemented

✅ All required routes and API endpoints
✅ Shortcode validation (regex: `[A-Za-z0-9]{6,8}`)
✅ 302 redirects with click tracking
✅ 404 after deletion
✅ 409 for duplicate codes
✅ Dashboard with search/filter
✅ Stats page with click visualization
✅ Copy-to-clipboard functionality
✅ Delete confirmation modal
✅ Form validation and error handling
✅ Responsive, accessible UI
✅ Health check endpoint
✅ Production-ready code quality

## Next Steps After Setup

1. Copy `env.example` to `.env` and add your DATABASE_URL
2. Run `npm install`
3. Run `npm run db:generate`
4. Run `npm run db:migrate`
5. Run `npm run dev`
6. Visit http://localhost:3000

## Deployment

See README.md for detailed Vercel + Neon deployment instructions.

