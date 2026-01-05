<!-- Copilot / AI agent instructions for the To-Let project -->
# To-Let — AI coding agent instructions

This file gives concise, actionable guidance so an AI coding agent can be productive immediately in this repository.

<!-- Copilot / AI agent instructions for the To-Let project -->
# To-Let — AI coding agent instructions (concise)

This file explains the minimal, project-specific context an AI coding agent needs to be productive in this repo.

## Architecture (big picture)
- Backend: Laravel app in the `backend` folder. Controllers: `backend/app/Http/Controllers`, models: `backend/app/Models`, API routes: `backend/routes/api.php`. Auth uses personal access tokens (`createToken`) and an `auth:admin` guard.
- Frontend: React + Vite in `frontend`. Entry: `frontend/src/main.jsx`. Central API client: `frontend/src/api.js` (handles base URL and token selection).

## Key developer workflows (commands)
- Backend (dev server, migrations, tests):
```bash
cd backend
composer install
cp .env.example .env   # fill DB/MAIL/PAYMENT
php artisan key:generate
php artisan migrate
php artisan serve --port=8000
php artisan test        # or ./vendor/bin/phpunit
```
- Frontend (dev):
```bash
cd frontend
npm install
npm run dev
```

## Project-specific conventions & examples
- API base URL: `VITE_API_URL` (see `frontend/src/api.js`). Client falls back to `http://127.0.0.1:8000/api` if unset.
- Tokens: `auth_token` (user) and `admin_token` (admin) stored in localStorage; requests to paths starting with `/admin` use the admin token.
- Auth flow: registration uses an email OTP; verification issues a token via `createToken('tolet_token')` (see `backend/app/Http/Controllers/AuthController.php`).
- Admin routes: defined in `backend/routes/api.php`, protected by `auth:admin` and prefixed with `/admin`.
- Payments: callbacks & gateway redirects are in `backend/routes/web.php`; credentials are in `.env`.
- Email templates: located at `backend/resources/views/emails`.

## Where to change things safely
- Add API endpoints: edit `backend/routes/api.php` and add controllers under `backend/app/Http/Controllers` (or `.../Admin`).
- Change models: edit `backend/app/Models` using Eloquent conventions (fillable/casts/relations).
- Frontend calls: reuse `frontend/src/api.js` to ensure correct tokens and base URL.

## Integration points & external deps
- Backend: Laravel, Sanctum (token creation via `createToken`), Mail, payment gateway callbacks.
- Frontend: `react-router`, `axios`, `react-leaflet`, `@react-google-maps/api`.

## Tests, linting, CI
- Backend tests: `php artisan test` (see `phpunit.xml`).
- Frontend lint: `cd frontend && npm run lint`.
- No repo-level CI by default; add GitHub Actions under `.github/workflows` if needed.

## Quick entry points (inspect first)
- `backend/app/Http/Controllers/AuthController.php` (auth + OTP)
- `backend/routes/api.php` (public vs admin APIs)
- `backend/routes/web.php` (payment callbacks)
- `frontend/src/api.js` (central API client)

## Small gotchas
- Search for hardcoded `http://127.0.0.1:8000` in `frontend/` before changing endpoints.
- Migration filenames are timestamped; schema changes often require `php artisan migrate:fresh --seed` in dev.

---
If you'd like this trimmed further or expanded with PR conventions, example `.env` values, or CI snippets, tell me which section to change.

