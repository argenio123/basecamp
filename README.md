# Basecamp CamSur website

Marketing website for Basecamp CamSur, built with Next.js 16 and the App Router.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```text
src/
├── app/                  # Routes, layouts, metadata, and global styles
├── components/
│   ├── forms/            # Interactive forms
│   ├── layout/           # Site-wide header and footer
│   └── sections/         # Reusable page sections
└── data/                 # Shared site content and configuration

public/
├── images/
│   ├── brand/            # Logos and brand marks
│   ├── facilities/       # Facility photography and renders
│   ├── hero/             # Hero artwork
│   └── programs/         # Program imagery
└── videos/               # Browser-served, optimized video files

media/
├── design-source/        # Editable design source files
├── documents/            # Project decks and reference documents
├── images/               # Original and reference imagery
└── videos/               # Original video footage and exports
```

Files in `public` are production assets and are referenced from the site with paths beginning at `/`, such as `/images/brand/basecamp-white-logo.png`. Files in `media` are working/source material and are not served by Next.js.

## Checks

```bash
npm run lint
npm run build
```

## Admin setup

Create a local `.env.local` file (it is gitignored) and set:

```dotenv
ADMIN_PASSWORD=choose-a-long-unique-password
ADMIN_SESSION_SECRET=replace-with-at-least-32-random-characters
```

Generate the session secret with `openssl rand -base64 32` (or any cryptographically secure password generator), then restart `npm run dev`. Sign in at `/login`; `/admin/login` permanently redirects there.

For Vercel, open the project’s **Settings → Environment Variables**, add the same two variables for Production and Preview, then redeploy. Add `KV_REST_API_URL` and `KV_REST_API_TOKEN` as well if admin edits must persist in production; without storage, the production admin is intentionally read-only.
