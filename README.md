# Product Feedback

A product-feedback prototype for collecting structured feedback across multiple applications and giving product teams one place to review and manage the results.

**Live demo:** https://product-feedback-green.vercel.app

## Status

Product prototype. There are no automated tests, no CI workflow, no database migrations in the repo, and no license file.

## Features

- **Applications gallery** with search by project name. Each project has a name, description, image, and link to the live application.
- **Per-project feedback survey** with four question types: short text, long text, star rating, and radio buttons. Questions can be required or optional.
- **Visitor details:** the survey asks for the visitor's name and department. Submissions are stored in Supabase together with the answers.
- **Guest flow:** a visitor can continue as a guest without signing in, submit feedback, and see a thank-you page.
- **Admin sign-in** with email and password through Supabase Auth. A signed-in user gets the admin view.
- **Admin dashboard** with three tabs: projects (add, edit, delete), survey questions (add, edit, delete through a form builder), and results.
- **Results:** a list of submissions and an analytics view with rating charts and averages per project.
- **Default survey:** if no questions are found in the database, a built-in default set of eight questions (ratings, text, and an optional device/OS field) is used (`constants.ts`).
- Loading screen, modals, and toast notifications.

## Tech stack

- React 19 and TypeScript
- Vite 6 (dev server on port 3000)
- Supabase (`@supabase/supabase-js`) for authentication and the `projects`, `survey_questions`, and `survey_responses` tables
- Tailwind CSS loaded from the CDN in `index.html`

## Getting started

Prerequisites: Node.js and npm.

```bash
npm install
npm run dev      # start the Vite dev server
npm run build    # production build
npm run preview  # preview the production build
```

### Supabase configuration

The Supabase project URL and anon key are set directly in `lib/supabaseClient.ts`; the app does not read them from environment variables, and there is no `.env.example`. To run your own instance, create a Supabase project with the three tables above (their columns follow the types in `types.ts`), create an admin user in Supabase Auth, and replace the values in `lib/supabaseClient.ts` with your own project's URL and anon key. Never use a service-role key in client code.

Any signed-in Supabase user is treated as an admin by the client, so access control for writes depends on the row-level security policies you configure in Supabase.

## Project structure

```
App.tsx                 App state, Supabase calls, and view routing (gallery, project detail, thank-you, admin)
components/             UI components (login, gallery cards, survey form, admin page, form builder, analytics, ...)
lib/supabaseClient.ts   Supabase client
types.ts                Project, SurveyQuestion, and SurveyResponse types
constants.ts            Default survey questions
index.html              Entry page with Tailwind CDN setup
```
