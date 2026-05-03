# Pulse

**Pulse** is the frontend for the Atlas notification system. It lets you browse system email templates, create your own HTML templates with a live preview, and send transactional emails — all through the Atlas API Gateway.

Built with Next.js 15 (App Router), TypeScript, and Tailwind CSS.

---

## Features

| Page | Auth required | Description |
|---|---|---|
| `/templates` | No | Browse all system email templates with modal previews |
| `/my-templates` | Yes | Create, view, and delete custom HTML email templates |
| `/send` | Yes | Send an email using any system or custom template |

- **Live template preview** — the create-template form renders your HTML in a sandboxed `<iframe>` in real time, styled as a mock email client window
- **Variable substitution** — templates support `{{varName}}` placeholders; the send form auto-extracts known variables when you pick a template
- **Cookie-based auth** — auth state is read from the Atlas Gateway `httpOnly` cookie; no tokens are stored in the browser
- **Server-side data fetching** — the templates list page fetches on the server for instant first paint; user-specific pages fetch client-side with credentials

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styles | Tailwind CSS 3 |
| Package manager | pnpm |
| Backend | Atlas API Gateway (NestJS, port 3000) |

---

## Project Structure

```
app/
 ├── layout.tsx          # Root layout — AuthProvider + Nav
 ├── page.tsx            # Redirects / → /templates
 ├── templates/
 │   └── page.tsx        # Server component — fetches and renders system templates
 ├── my-templates/
 │   └── page.tsx        # Client component — CRUD for user templates (login-gated)
 └── send/
     └── page.tsx        # Send email page (login-gated)

components/
 ├── providers.tsx        # AuthProvider — cookie auth state via React context
 ├── nav.tsx             # Sticky header with tabs and sign-out button
 ├── template-grid.tsx   # Grid layout for system template cards
 ├── template-card.tsx   # System template card with preview trigger
 ├── preview-modal.tsx   # Modal showing a rendered template preview
 ├── user-template-card.tsx  # User template card with delete action
 ├── create-template-form.tsx  # HTML editor + live iframe preview
 ├── send-email-form.tsx # Full send form: template picker + recipients + variables
 └── login-gate.tsx      # Wraps protected pages; shows login prompt if unauthenticated

lib/
 ├── api.ts              # Server-side fetch helpers (no credentials)
 ├── client-api.ts       # Client-side fetch helpers (credentials: include)
 └── types.ts            # Shared TypeScript types (Template, UserTemplate, TemplateField)
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- The **Atlas API Gateway** running on port 3000 (see the Atlas backend repo)

### Install

```bash
pnpm install
```

### Configure environment

Copy the example and fill in your values:

```bash
cp .env.local.example .env.local
```

```env
# Atlas Gateway URL — must be browser-accessible (used for all API calls and iframe previews)
NEXT_PUBLIC_GATEWAY_URL=http://localhost:3000

# Public app URL — used for Open Graph metadata
NEXT_PUBLIC_APP_URL=http://localhost:3009
```

### Run

```bash
pnpm dev       # starts on http://localhost:3009
pnpm build     # production build
pnpm start     # serve production build on port 3009
pnpm lint      # ESLint
```

---

## Authentication

Pulse does not implement its own auth. Login happens through the Atlas Gateway's auth endpoints (`/auth/login`, `/auth/google`), which set `httpOnly` cookies on the gateway domain.

On startup, `AuthProvider` fires a probe request to `GET /user-templates` — if it returns 200, the user is considered authenticated. This avoids storing any token in `localStorage` or React state.

Protected pages are wrapped in `<LoginGate>`, which renders a sign-in prompt instead of the page when the user is not authenticated.

---

## API Layers

### `lib/api.ts` — server-side

Used in Server Components (e.g. the templates list page). Fetches from the gateway without cookies — suitable for public endpoints only.

```ts
api.templates.list()  // GET /templates
```

### `lib/client-api.ts` — client-side

Used in Client Components and forms. Sends `credentials: 'include'` so the gateway cookie is forwarded on every request.

```ts
clientApi.templates.list()              // GET /templates
clientApi.userTemplates.list()          // GET /user-templates
clientApi.userTemplates.create(data)    // POST /user-templates
clientApi.userTemplates.delete(id)      // DELETE /user-templates/:id
clientApi.notify.send(data)             // POST /notify/send
```

Both export an `ApiError` class with a `status` field so components can distinguish 401 / 403 from network failures.

---

## Template Variables

Templates use `{{varName}}` as placeholder syntax. When you select a template on the Send page:

- **System templates** — the gateway returns a `fields` array listing the expected variables, which are pre-populated in the form
- **User templates** — the client parses `{{...}}` occurrences in the stored HTML to extract variables automatically

The `templateData` object (`{ [varName]: value }`) is sent to `POST /notify/send`, where the Atlas Notification Service performs substitution before dispatching via Resend.

---

## Gateway Endpoints Used

| Method | Path | Auth | Used by |
|---|---|---|---|
| GET | `/templates` | No | Templates page, Send form |
| GET | `/templates/:id/preview` | No | Preview modal (iframe src) |
| GET | `/user-templates` | Cookie | My Templates page, auth probe |
| POST | `/user-templates` | Cookie | Create template form |
| DELETE | `/user-templates/:id` | Cookie | User template card |
| POST | `/notify/send` | Cookie | Send email form |
| POST | `/auth/logout` | Cookie | Nav sign-out button |

All requests go to `NEXT_PUBLIC_GATEWAY_URL`. CORS is handled on the gateway side with `credentials: true`.
