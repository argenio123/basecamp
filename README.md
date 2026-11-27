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

Each staff member signs in with their own email and password, so the logs show who changed what and one person's access can be removed without affecting anyone else. Accounts live in configuration (no database screen): `ADMIN_USERS` lists `email:hash` entries, separated by commas (or new lines), and holds password **hashes only** — never plain passwords.

Create a local `.env.local` file (it is gitignored) and set:

```dotenv
ADMIN_USERS=ana@example.com:s1.<salt>.<key>,ben@example.com:s1.<salt>.<key>
ADMIN_SESSION_SECRET=replace-with-at-least-32-random-characters
```

Generate the session secret with `openssl rand -base64 32` (or any cryptographically secure password generator), then restart `npm run dev`. Sign in at `/login`; `/admin/login` permanently redirects there. The admin header shows "Signed in as <email>".

**Add a staff member:** they run `node scripts/hash-admin-password.mjs their@email.example` (no install needed), type their password twice (12+ characters; input is hidden), and send you the single `email:s1.…` line it prints — the line contains only a salted scrypt hash, not the password. Append it to `ADMIN_USERS` with a comma, then restart or redeploy.

**Remove someone or reset a password:** delete their entry (or replace it with a new line from the script) and redeploy. Their open sessions stop working straight away; nobody else is signed out. Changing `ADMIN_SESSION_SECRET` signs everyone out.

**Audit trail:** every admin change (section save/reset, lead status/notes update, lead delete, CSV export, sign-in, sign-out) writes one `[admin-audit]` JSON line to the server logs with the time, the staff email, the action and the section or lead id. On Vercel, search the project's **Logs** for `[admin-audit]`.

**Legacy shared password:** if `ADMIN_USERS` is unset or blank, the old single `ADMIN_PASSWORD` login keeps working exactly as before (password only, sessions recorded as `shared-password`). If both are set, `ADMIN_USERS` wins and `ADMIN_PASSWORD` is ignored — remove it once everyone has a personal account. Switching from one mode to the other signs everyone out once. If `ADMIN_USERS` is set but none of its entries is valid, nobody can sign in (it never falls back to the shared password); malformed entries are reported, without their contents, in the server log.

For Vercel, open the project’s **Settings → Environment Variables**, add `ADMIN_USERS` (or the legacy `ADMIN_PASSWORD`) and `ADMIN_SESSION_SECRET` for Production and Preview, then redeploy (the sign-in page is pre-rendered, so a change of mode needs a redeploy to show the email field). Add `KV_REST_API_URL` and `KV_REST_API_TOKEN` as well if admin edits must persist in production; without storage, the production admin is intentionally read-only.
