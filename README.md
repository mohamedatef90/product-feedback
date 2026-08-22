# Product Feedback

A product-feedback prototype for collecting structured feedback across multiple applications and giving product teams one place to review and manage the results.

**Live demo:** https://product-feedback-green.vercel.app

## What it demonstrates

- Searchable application gallery
- Per-project feedback surveys
- Rating, text, and long-form question types
- Guest feedback flow and confirmation experience
- Supabase authentication and persistence
- Admin views for projects, survey questions, and responses
- Project and question CRUD workflows
- Responsive React interface with loading, modal, and toast states

## Product intent

The prototype explores a lightweight feedback-operations workflow: users choose the product they want to comment on, submit contextual feedback, and product teams review the responses from a shared administration experience.

## Tech stack

- React 19
- TypeScript
- Vite
- Supabase Auth and Database

## Run locally

```bash
npm install
npm run dev
```

A Supabase project is required for authentication and persisted project, survey, and response data. Use environment-managed client configuration before deploying your own instance; never expose a Supabase service-role key in frontend code.

## Build

```bash
npm run build
npm run preview
```

## Status

Product prototype. Before production use, add automated tests, role-based authorization policies, environment-based Supabase configuration, analytics, and a documented database migration path.
