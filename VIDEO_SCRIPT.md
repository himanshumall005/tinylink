# TinyLink Application - Video Script

**Duration: 2-3 minutes**

---

## Introduction (0:00 - 0:15)

"Hi! Welcome to this walkthrough of TinyLink, a production-ready URL shortener application built with Next.js, TypeScript, and PostgreSQL. This is a complete bit.ly clone that follows all the requirements from the assignment specification."

---

## Tech Stack Overview (0:15 - 0:30)

"TinyLink is built with:
- Next.js 14 using the App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Prisma ORM for database management
- PostgreSQL hosted on Neon
- Zod for validation"

---

## Setup and Installation (0:30 - 1:00)

"Let me show you how to get started. First, install dependencies with `npm install`. Then, copy the environment example file to create your `.env` file and add your Neon PostgreSQL connection string. Next, generate the Prisma client with `npm run db:generate`, and run migrations with `npm run db:migrate`. Finally, start the development server with `npm run dev`."

[Show terminal commands being executed]

---

## Dashboard Features (1:00 - 1:30)

"Now let's explore the dashboard. Here you can see all your shortened links in a clean table format. The dashboard includes:
- A search bar to filter links by code or URL
- A table showing code, target URL, click counts, and last clicked time
- Action buttons for each link: Copy, Stats, and Delete

Let me create a new link. I'll click 'Add Link', enter a URL - let's use Google - and optionally provide a custom code. I'll use 'google1'. Notice the inline validation - if I enter an invalid code format, it shows an error immediately. After submitting, the link appears in the table."

[Show creating a link, demonstrate validation]

---

## Redirect and Click Tracking (1:30 - 1:45)

"Now let's test the redirect functionality. When I visit the short URL - `localhost:3000/google1` - it redirects to the original URL with a 302 status code. Notice that the click count automatically increments, and the last clicked timestamp updates."

[Show redirect in action, refresh dashboard to show updated clicks]

---

## Statistics Page (1:45 - 2:00)

"Clicking 'Stats' takes us to a detailed statistics page. Here we can see:
- The full short URL with a copy button
- The target URL
- Total clicks, creation date, and last clicked time
- A visual graph showing clicks over the last 7 days

The copy button makes it easy to share the short link."

[Show stats page, demonstrate copy functionality]

---

## API Endpoints and Testing (2:00 - 2:30)

"TinyLink provides a complete REST API. Let me demonstrate with cURL:

First, the health check endpoint returns the service status. Creating a link via API works the same as the UI. If I try to create a duplicate code, it returns a 409 conflict error. After deletion, visiting the short URL returns a 404, as expected."

[Show cURL examples or API testing]

---

## Deployment (2:30 - 2:45)

"For deployment to Vercel, simply connect your GitHub repository, add your Neon database connection string as an environment variable, and deploy. After deployment, run the Prisma migrations to set up your production database. The application is fully production-ready with proper error handling, validation, and responsive design."

---

## Conclusion (2:45 - 3:00)

"TinyLink is a complete, production-ready URL shortener that meets all assignment requirements. It includes proper validation, error handling, click tracking, and a polished user interface. The codebase is modular, well-typed, and follows best practices. Thank you for watching!"

---

## Key Points to Highlight

- ✅ All routes and API endpoints match the specification exactly
- ✅ Shortcode validation (6-8 alphanumeric characters)
- ✅ 302 redirects with click tracking
- ✅ 404 after deletion
- ✅ 409 for duplicate codes
- ✅ Responsive, accessible UI
- ✅ Production-ready code quality

---

## Tips for Recording

1. Use screen recording software (OBS, Loom, or QuickTime)
2. Show terminal commands clearly
3. Demonstrate both UI and API functionality
4. Test edge cases (duplicate codes, invalid inputs, deleted links)
5. Keep transitions smooth and narration clear
6. Use browser dev tools to show network requests when testing API

