## Integration Steps for Dashboard & Roles (leave IoT Monitor untouched)

1) **Auth roles dropdown**  
   - Endpoint: `GET /api/auth/roles`  
   - Use after app load to populate role selectors (e.g., admin user editor). Cache in memory.

2) **Login**  
   - Endpoint: `POST /api/auth/login` with `email`, `password`.  
   - Store JWT; set `Authorization: Bearer <token>` on subsequent requests.

3) **Dashboard data fetch**  
   - Endpoint: `GET /api/dashboard` (requires JWT).  
   - Returns: navigation array, user info, summary counts (users, appointments, diagnostics, subscriptions), upcoming appointments, recent diagnostics, AI quick actions, pricing suggestions.  
   - Role scoping: patients/caregivers see their own data; doctors see their appointments; admins see system-wide aggregates.

4) **Home page**  
   - Render summary cards from `summary.*`.  
   - Use `navigation` array to drive top-level menu.

5) **Consultation page**  
   - Use `consultation.upcoming` for the list/table; show date, status.  
   - Actions (reschedule/cancel) can call existing appointments routes if needed (`/api/appointments/:id`).

6) **Diagnostics page**  
   - Use `diagnostics.recent` for recent tests; show type/status; link to detail via `/api/diagnostics/:id`.

7) **AI Assistant**  
   - Seed quick actions from `aiAssistant.quickActions`; wire to your AI UI flow (no backend change needed).

8) **Pricing**  
   - Render plans from `pricing.suggestedPlans` for the Pricing page.

9) **IoT Monitor (guidelines only; no backend changes)**  
   - Read-only use of existing endpoints: `/api/v1/data`, `/api/v1/data/latest`, `/api/v1/data/history`.  
   - For realtime, use websocket namespace `/` listening to `initial-data` and `new-data`.  
   - Avoid sending writes from dashboard to IoT; keep updates isolated to sensor routes.

10) **Testing**  
    - Start backend: `npm run dev`.  
    - Hit `GET /api/auth/roles` (no auth) and `GET /api/dashboard` (with JWT) to verify payloads.  
    - Ensure CORS origin list in `.env` includes your frontend host.
