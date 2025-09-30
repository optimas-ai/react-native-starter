# React Native Interview Exercise

Welcome!  
This repo contains a starter Expo + TypeScript project and a small mock API.  
Your goal is to build a minimal but production-grade mobile feature that demonstrates:

- Solid React Native + TypeScript skills
- Good data-fetching patterns
- Image/file upload handling
- Offline resilience and clear UX

---

## 📝 The Task

Choose **one** of the three variants below and implement it end-to-end.  
Pick the one that lets you best showcase your strengths.

### Option A — Activities

- **Feed**: List activities from `GET /activities`.
- **Create**: Add a new activity with description (required), category (from `GET /categories`), and a photo (camera or library).
- **Upload**: Images must follow the pre-signed upload flow:
  1. `POST /upload/init` → `{ uploadUrl, fileUrl }`
  2. `PUT` the file to `uploadUrl`
  3. Send `fileUrl` in the `POST /activities` request.
- **Offline**: If the create call fails with **503**, store it locally (e.g., AsyncStorage) and show the item as **Pending** in the feed. Provide a way to retry.

### Option B — Tickets

- Paginated list from `GET /tickets?page=N`.
- Create a ticket with title, comment, and optional photo using the same upload flow.
- Bonus: Optimistic add & rollback on failure.

### Option C — Documents

- List documents from `GET /docs`.
- Detail screen shows the PDF (use a WebView or PDF viewer).
- Cache files for offline access.

> **Focus on:** clean architecture, reliability, and a smooth user experience—not pixel-perfect design.

## 📡 API Reference

### Activities

- `GET /activities`  
  → `{ items: [...] }`

- `POST /activities`  
  → Create a new activity  
  → May respond with `503` for temporary outage

---

### Tickets

- `GET /tickets?page=N`  
  → Paginated list of tickets  
  → Response: `{ items: [...], nextPage: number | null }`

- `POST /tickets`  
  → Create a new ticket  
  → May respond with `503` for temporary outage

---

### Documents

- `GET /docs`  
  → `{ items: [...] }`

- `GET /docs/:id/file`  
  → `{ url: "https://example.com/fake-<id>.pdf" }`

---

### Categories

- `GET /categories`  
  → `{ items: [...] }`

---

### Upload

- `POST /upload/init`  
  → `{ uploadUrl, fileUrl }`

- `PUT {uploadUrl}`  
  → Upload a file (raw body)

- `GET {fileUrl}`  
  → Returns uploaded file metadata `{ ok: true, id: ... }`

---

### Admin (for testing failures & delays)

- `GET /__admin`  
  → `{ failOnce: boolean, delayMs: number }`

- `POST /__admin/toggle`  
  → Body: `{ type: "failOnce" | "delayMs", value: any }`  
  → Example: `{ "type": "failOnce", "value": true }`
