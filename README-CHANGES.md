## API Base URL Refactor - Step by Step

### 1) Goal

Unify all API calls behind a single, environment-driven base URL and remove hardcoded `localhost` usages.

### 2) What was added

- Created `src/config/api.ts` with:
  - `API_BASE_URL`: reads from `import.meta.env.VITE_API_BASE_URL` and falls back to `http://localhost:3000`.
  - `withApiBase(path)`: helper to safely prepend the base URL to relative API paths.

Current `src/config/api.ts` logic:

```ts
export const API_BASE_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  "http://localhost:3000";

export const withApiBase = (path: string): string => {
  if (!path) return API_BASE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const trimmedBase = API_BASE_URL.replace(/\/$/, "");
  const trimmedPath = path.replace(/^\//, "");
  return `${trimmedBase}/${trimmedPath}`;
};
```

Notes:

- If you want to target a specific host like `http://147.93.156.11:3000`, set `VITE_API_BASE_URL` accordingly (see step 4).

### 3) Files updated to use the helper

- `src/composables/useAuth.ts`
  - Replaced `axios.post("http://localhost:3000/api/auth/login", ...)` with `axios.post(withApiBase("/api/auth/login"), ...)`.
- `src/pages/Students.vue`
  - Replaced `const API_URL = "http://localhost:3000/api/students"` with `const API_URL = withApiBase("/api/students")`.
- `src/pages/Books.vue`
  - Replaced constants:
    - `API_URL` -> `withApiBase("/api/books")`
    - `CATEGORY_API_URL` -> `withApiBase("/api/categories")`
    - `AUTHOR_API_URL` -> `withApiBase("/api/authors")`
    - `SEARCH_API_URL` -> `withApiBase("/api/books/search")`
- `src/pages/Borrowing.vue`
  - Replaced fetch calls:
    - Search: `withApiBase(`/api/books/search?query=${encodeURIComponent(searchQuery.value)}`)`
    - List: `withApiBase(`/api/borrows?page=${page}&limit=10`)`
    - Create: `withApiBase("/api/borrows")`
    - Return: `withApiBase(`/api/borrows/${borrowId}/return`)`
    - Delete: `withApiBase(`/api/borrows/${borrowId}`)`
- `src/pages/Dashboard.vue`
  - Replaced fetch URL with `withApiBase("/api/dashboard")`.

### 4) Environment configuration

This project uses Vite-style env vars. Create these files at the project root (same level as `package.json`):

- `.env.development`

```
VITE_API_BASE_URL=http://147.93.156.11:3000
```

- `.env.production`

```
VITE_API_BASE_URL=http://147.93.156.11:3000
```

Adjust the host/port as needed. After creating or changing env files, restart the dev server so Vite picks up changes.

### 5) How to use `withApiBase` in new code

```ts
import { withApiBase } from "../config/api"; // adjust the path as needed

// For axios
await axios.get(withApiBase("/api/books"));

// For fetch
await fetch(withApiBase(`/api/books/${bookId}`));

// If you already have a full URL, it passes through unchanged
await fetch(withApiBase("https://example.com/health"));
```

Tips:

- Always pass relative paths like `/api/...` so environments can switch without code edits.
- Query strings are safe to include in the relative path you pass to `withApiBase`.

### 6) Testing checklist

- Set the base URL in `.env.development`.
- Restart dev server.
- Log in via the app (auth call should hit the configured host).
- Navigate to: Dashboard, Students, Books, Borrowing.
- Verify network requests point to your configured host in the browser devtools.

### 7) Rollback / Override options

- To temporarily target another backend, change `VITE_API_BASE_URL` and restart the dev server.
- To hardcode for quick local testing, you could temporarily set:

```ts
// src/config/api.ts
export const API_BASE_URL = "http://localhost:3000";
```

(But prefer env variables for consistency.)

### 8) Why this approach

- Single source of truth for the API host.
- No duplicate string literals for host/port across the app.
- Easier environment switches (dev/stage/prod) without code changes.
