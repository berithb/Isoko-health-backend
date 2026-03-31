## IsokoHealth Backend

### Local run

1. Create `.env` from `.env.example`
2. Install dependencies with `npm install`
3. Start dev server with `npm run dev`
4. Open `http://localhost:4000/api-docs`

### Deployment checklist

For Render, Railway, or similar platforms:

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Root directory: `Isoko-health-backend` if your repo contains other folders

Required environment variables:

- `PORT=4000`
- `HOST=0.0.0.0`
- `JWT_SECRET=your-secret`
- `JWT_EXPIRES_IN=1d`
- `MONGO_URI=your-cloud-mongodb-uri`

Important:

- Do not use `mongodb://localhost:27017/isokohealth` on a hosted deployment
- `localhost` on Render/Railway means the remote container itself, not your laptop
- Use MongoDB Atlas or another cloud MongoDB service for `MONGO_URI`

Useful URLs after deploy:

- `/`
- `/health`
- `/api-docs`
- `/api/v1/data`
- `/api/v1/data/latest`
