# Database Refactor Plan (xmongo.db)

## Goals
- Keep existing `users` collection intact for sign-in (no field renames or type changes).
- Align other collections with current Mongoose models for consistent communication.
- Normalize references using `ObjectId` links to `users` while keeping simple, query-friendly shapes.
- Add indexes and timestamps to support common queries and device data ingestion.

## Collections & Schemas
- `users` (existing)
  - Leave schema as-is. Ensure unique index on `email`, password hashing pre-save, `passwordResetToken/Expires` retained.
  - Used as the foreign key target for all `userId` refs below.

- `appointments`
  - Fields: `patientId` (ObjectId?users), `doctorId` (ObjectId?users), `date` (Date), `status` (pending|completed|cancelled), `createdAt`, `updatedAt`.
  - Indexes: `{ patientId:1, date: -1 }`, `{ doctorId:1, date:-1 }` for dashboards.

- `diagnostictests`
  - Fields: `userId` (ObjectId?users), `type` (String), `result` (String?), `status` (requested|in-progress|completed), timestamps.
  - Index: `{ userId:1, status:1, createdAt:-1 }`.

- `healthrecords`
  - Fields: `userId` (ObjectId?users), vitals (`bloodPressure` String, `glucose` Number, `temperature` Number), `createdAt`.
  - Index: `{ userId:1, createdAt:-1 }`.

- `subscriptions`
  - Fields: `userId` (ObjectId?users), `plan` (String), `status` (active|inactive|cancelled), timestamps.
  - Index: `{ userId:1, status:1 }`.

- `sensorreadings`
  - Fields: `device_id` (String, required, indexed), `timestamp` (Date, indexed), `sensors` (temperature, humidity, distance, motion Numbers), `alerts` (fall_detected, fever_detected, emergency Booleans), timestamps.
  - Compound index: `{ device_id:1, timestamp:-1 }` for time-series queries.

## Relationships & Communication Patterns
- All domain collections use `ObjectId` references to `users` for authorization and personalization.
- Appointment `patientId`/`doctorId` remain separate to support role-based joins; enforce role checks in controllers, not schema.
- Sensor ingestion writes directly to `sensorreadings`; alerting services can watch change streams on this collection filtered by `alerts.*`.
- Health dashboards aggregate from `sensorreadings`, `healthrecords`, `diagnostictests`, and `appointments` by `userId`.

## Storage Target
- Database name: `xmongo.db`.
- Connection string example: `mongodb://<host>:<port>/xmongo.db` (or set `MONGO_URI` accordingly).

## Migration Notes
- No data migration needed for `users`; verify unique index on `email` exists.
- For other collections, ensure existing documents conform to the model enums; run cleanup scripts if legacy statuses exist.
- Create indexes via startup script or one-time migration to avoid collection scans.

## Next Steps
1) Add index creation to Mongoose connection bootstrap (idempotent).
2) Review controllers/services to ensure they use the `userId`/`patientId`/`doctorId` refs consistently.
3) Set `MONGO_URI` to point at `xmongo.db` and verify connectivity.
