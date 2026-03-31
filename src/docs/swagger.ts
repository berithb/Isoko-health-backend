import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'IsokoHealth API',
      version: '1.0.0',
      description: 'API documentation for IsokoHealth digital health platform',
    },
    tags: [
      { name: 'Auth' },
      { name: 'Users' },
      { name: 'Appointments' },
      { name: 'HealthRecords' },
      { name: 'Diagnostics' },
      { name: 'Admin' },
      { name: 'AI' },
      { name: 'Chat' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Mongo ObjectId' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['patient', 'doctor', 'admin', 'caregiver'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        UserRegister: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string', minLength: 6 },
          },
        },
        SensorReading: {
          type: 'object',
          required: ['device_id', 'timestamp', 'sensors', 'alerts'],
          properties: {
            _id: { type: 'string', description: 'Mongo ObjectId' },
            device_id: { type: 'string', example: 'esp32-001' },
            timestamp: { type: 'string', format: 'date-time', example: '2026-03-30T22:15:00.000Z' },
            sensors: {
              type: 'object',
              properties: {
                temperature: { type: 'number', example: 36.5 },
                humidity: { type: 'number', example: 68 },
                distance: { type: 'number', example: 4.2 },
                motion: { type: 'number', example: 1 },
              },
            },
            alerts: {
              type: 'object',
              properties: {
                fall_detected: { type: 'boolean', example: false },
                fever_detected: { type: 'boolean', example: true },
                emergency: { type: 'boolean', example: false },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        SensorReadingCreate: {
          type: 'object',
          required: ['device_id', 'timestamp', 'sensors', 'alerts'],
          properties: {
            device_id: { type: 'string', example: 'esp32-001' },
            timestamp: { type: 'string', example: '2026-03-30T22:15:00' },
            sensors: {
              type: 'object',
              required: ['temperature', 'humidity', 'distance', 'motion'],
              properties: {
                temperature: { type: 'number', example: 36.5 },
                humidity: { type: 'number', example: 68 },
                distance: { type: 'number', example: 4.2 },
                motion: { type: 'number', example: 1 },
              },
            },
            alerts: {
              type: 'object',
              required: ['fall_detected', 'fever_detected', 'emergency'],
              properties: {
                fall_detected: { type: 'boolean', example: false },
                fever_detected: { type: 'boolean', example: true },
                emergency: { type: 'boolean', example: false },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UserRegister' } } } },
          responses: { 201: { description: 'User created' }, 409: { description: 'Email exists' } },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login and receive JWT',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } } } } } },
          responses: { 200: { description: 'Token issued' }, 401: { description: 'Invalid credentials' } },
        },
      },
      '/api/auth/forgot-password': {
        post: {
          tags: ['Auth'],
          summary: 'Request password reset token',
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { type: 'object', required: ['email'], properties: { email: { type: 'string', format: 'email' } } } },
            },
          },
          responses: { 200: { description: 'Reset token created' }, 404: { description: 'User not found' } },
        },
      },
      '/api/auth/reset-password': {
        post: {
          tags: ['Auth'],
          summary: 'Reset password using token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['token', 'password'],
                  properties: { token: { type: 'string' }, password: { type: 'string', minLength: 6 } },
                },
              },
            },
          },
          responses: { 200: { description: 'Password reset success (returns new JWT)' }, 400: { description: 'Invalid or expired token' } },
        },
      },
      '/api/users/me': {
        get: {
          tags: ['Users'],
          summary: 'Get my profile',
          description: 'Returns the authenticated user profile. Requires Bearer token.',
          responses: {
            200: {
              description: 'Profile retrieved',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
            },
            401: { description: 'Unauthorized' },
          },
        },
        put: {
          tags: ['Users'],
          summary: 'Update my profile',
          description: 'Updates your own profile name. Role cannot be changed here. Requires Bearer token. Use GET /api/users/me first to see your current values.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'Jane Doe' }
                  },
                },
                example: { name: 'Current Name' },
              },
            },
          },
          responses: {
            200: {
              description: 'Profile updated',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/User' },
                  example: {
                    _id: '60f8c0a2b6e0a72f9c123456',
                    name: 'Updated Name',
                    email: 'user@example.com',
                    role: 'patient',
                    createdAt: '2024-01-01T12:00:00.000Z',
                  },
                },
              },
            },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/appointments': {
        get: { tags: ['Appointments'], summary: 'List appointments', responses: { 200: { description: 'List' } } },
        post: { tags: ['Appointments'], summary: 'Book appointment', responses: { 201: { description: 'Created' } } },
      },
      '/api/appointments/{id}/status': {
        patch: {
          tags: ['Appointments'],
          summary: 'Update appointment status',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Updated' } },
        },
      },
      '/api/health-records': {
        get: { tags: ['HealthRecords'], summary: 'Fetch vitals', responses: { 200: { description: 'List' } } },
        post: { tags: ['HealthRecords'], summary: 'Submit vitals', responses: { 201: { description: 'Recorded' } } },
      },
      '/api/v1/data': {
        get: {
          tags: ['SensorData'],
          summary: 'Show available sensor data endpoints',
          security: [],
          responses: {
            200: {
              description: 'Sensor API overview',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'ok' },
                      message: { type: 'string', example: 'Sensor data API is available.' },
                      endpoints: {
                        type: 'object',
                        properties: {
                          post: { type: 'string', example: '/api/v1/data' },
                          latest: { type: 'string', example: '/api/v1/data/latest' },
                          history: { type: 'string', example: '/api/v1/data/history' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['SensorData'],
          summary: 'Store a sensor reading from Wokwi or ESP32',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SensorReadingCreate' },
              },
            },
          },
          responses: {
            201: {
              description: 'Reading stored',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'success' },
                      id: { type: 'string', example: '6608ac2e85d2b684d0f7f0d1' },
                    },
                  },
                },
              },
            },
            400: { description: 'Validation error' },
          },
        },
      },
      '/api/v1/data/latest': {
        get: {
          tags: ['SensorData'],
          summary: 'Fetch the latest stored sensor reading',
          security: [],
          responses: {
            200: {
              description: 'Latest reading or empty state',
              content: {
                'application/json': {
                  schema: {
                    oneOf: [
                      { $ref: '#/components/schemas/SensorReading' },
                      {
                        type: 'object',
                        properties: {
                          status: { type: 'string', example: 'empty' },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/data/history': {
        get: {
          tags: ['SensorData'],
          summary: 'Fetch sensor history',
          security: [],
          parameters: [
            {
              name: 'device_id',
              in: 'query',
              required: false,
              schema: { type: 'string' },
              description: 'Filter history to a single device',
            },
            {
              name: 'limit',
              in: 'query',
              required: false,
              schema: { type: 'integer', minimum: 1, maximum: 500, default: 50 },
              description: 'Maximum number of records to return',
            },
          ],
          responses: {
            200: {
              description: 'Historical readings',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/SensorReading' },
                  },
                },
              },
            },
          },
        },
      },
      '/api/diagnostics': {
        get: { tags: ['Diagnostics'], summary: 'Get diagnostic tests', responses: { 200: { description: 'List' } } },
        post: { tags: ['Diagnostics'], summary: 'Request diagnostic test', responses: { 201: { description: 'Requested' } } },
      },
      '/api/diagnostics/{id}/result': {
        patch: {
          tags: ['Diagnostics'],
          summary: 'Upload diagnostic result',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Updated' } },
        },
      },
      '/api/admin/users': {
        get: { tags: ['Admin'], summary: 'List all users', responses: { 200: { description: 'List' } } },
      },
      '/api/admin/users/{userId}/subscription': {
        put: {
          tags: ['Admin'],
          summary: 'Manage subscription',
          parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Updated' } },
        },
      },
      '/api/admin/users/{userId}/role': {
        put: {
          tags: ['Admin'],
          summary: 'Update a user role (admin only)',
          parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { type: 'object', required: ['role'], properties: { role: { type: 'string', enum: ['patient', 'doctor', 'admin', 'caregiver'] } } },
              },
            },
          },
          responses: { 200: { description: 'Role updated' }, 404: { description: 'User not found' } },
        },
      },
      '/api/admin/analytics': {
        get: { tags: ['Admin'], summary: 'View analytics', responses: { 200: { description: 'Analytics' } } },
      },
      '/api/ai': {
        post: {
          tags: ['AI'],
          summary: 'Run an AI helper (symptom checker, summaries, lab explainer, etc.)',
          description:
            'Sends the requested feature and payload to OpenAI. Requires OPENAI_API_KEY in backend env. No auth by default—secure accordingly.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['feature'],
                  properties: {
                    feature: {
                      type: 'string',
                      enum: ['symptom_checker', 'history_summary', 'chronic_monitoring', 'lab_explainer', 'telemedicine_intake'],
                    },
                    payload: { type: 'object', description: 'Input specific to the feature.' },
                    previewOnly: { type: 'boolean', description: 'If true, return system + userMessage without calling Claude.' },
                  },
                  example: {
                    feature: 'symptom_checker',
                    payload: { symptoms: 'fever 38.5C, dry cough, sore throat, fatigue' },
                    previewOnly: false,
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'AI response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      feature: { type: 'string' },
                      system: { type: 'string' },
                      userMessage: { type: 'string' },
                      reply: { type: 'string' },
                    },
                  },
                  example: {
                    feature: 'symptom_checker',
                    system:
                      'You are a medical triage assistant. Based on symptoms, suggest urgency level (emergency/soon/routine) and relevant specialist. Never diagnose — always recommend seeing a doctor.',
                    userMessage: 'Patient symptoms: fever 38.5C, dry cough, sore throat, fatigue',
                    reply:
                      'Urgency: routine. Likely viral upper respiratory infection. See a primary care doctor if symptoms worsen, last >7 days, or if breathing issues appear.',
                  },
                },
              },
            },
            400: { description: 'Unsupported feature or bad payload' },
            500: { description: 'Server/AI error' },
          },
        },
      },
      '/api/chat': {
        post: {
          tags: ['Chat'],
          summary: 'General chat with OpenAI (multi-turn payload)',
          description: 'Send an array of messages; optionally include a system prompt. Requires OPENAI_API_KEY.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['messages'],
                  properties: {
                    system: { type: 'string', description: 'Optional system prompt to steer style/role.' },
                    messages: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['role', 'content'],
                        properties: {
                          role: { type: 'string', enum: ['user', 'assistant'] },
                          content: { type: 'string' },
                        },
                      },
                    },
                    previewOnly: { type: 'boolean', description: 'If true, returns prompt but skips model call.' },
                  },
                  example: {
                    system: 'You are a friendly concierge.',
                    messages: [
                      { role: 'user', content: 'Book me a table for two at 7pm near downtown.' },
                    ],
                    previewOnly: false,
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Chat response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      system: { type: 'string', nullable: true },
                      messages: { type: 'array' },
                      reply: { type: 'string', nullable: true },
                    },
                  },
                  example: {
                    system: 'You are a friendly concierge.',
                    messages: [{ role: 'user', content: 'Book me a table for two at 7pm near downtown.' }],
                    reply: 'Sure—any cuisine preference and budget?',
                  },
                },
              },
            },
            400: { description: 'Validation error' },
            500: { description: 'Server/AI error' },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
