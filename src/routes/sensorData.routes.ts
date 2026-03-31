import { Router } from 'express';
import { z } from 'zod';
import * as SensorDataController from '../controllers/sensorData.controller';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

const isoDateSchema = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: 'timestamp must be a valid ISO date string',
});

const createSensorDataSchema = z.object({
  body: z.object({
    device_id: z.string().min(1),
    timestamp: isoDateSchema,
    sensors: z.object({
      temperature: z.number(),
      humidity: z.number(),
      distance: z.number(),
      motion: z.number(),
    }),
    alerts: z.object({
      fall_detected: z.boolean(),
      fever_detected: z.boolean(),
      emergency: z.boolean(),
    }),
  }),
});

const historyQuerySchema = z.object({
  query: z.object({
    device_id: z.string().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(500).optional(),
  }),
  body: z.object({}).optional(),
  params: z.object({}).optional(),
});

const idSchema = z.object({ params: z.object({ id: z.string() }) });

const updateSensorDataSchema = z.object({
  body: z.object({
    device_id: z.string().min(1).optional(),
    timestamp: isoDateSchema.optional(),
    sensors: z
      .object({
        temperature: z.number().optional(),
        humidity: z.number().optional(),
        distance: z.number().optional(),
        motion: z.number().optional(),
      })
      .optional(),
    alerts: z
      .object({
        fall_detected: z.boolean().optional(),
        fever_detected: z.boolean().optional(),
        emergency: z.boolean().optional(),
      })
      .optional(),
  }),
  params: z.object({ id: z.string() }),
});

router.post('/', validate(createSensorDataSchema), SensorDataController.create);
router.get('/', SensorDataController.index);
router.get('/latest', SensorDataController.fetchLatest);
router.get('/history', validate(historyQuerySchema), SensorDataController.fetchHistory);
router.get('/:id', validate(idSchema), SensorDataController.getOne);
router.put('/:id', validate(updateSensorDataSchema), SensorDataController.update);
router.delete('/:id', validate(idSchema), SensorDataController.remove);

export default router;
