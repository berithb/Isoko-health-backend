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
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
