import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Appointment Booking System API',
      version: '1.0.0',
      description: 'RESTful API for the Appointment Booking System — ITAS4/ITAS5 Final Project',
      contact: { name: 'Dev Team', email: 'team@appointbook.dev' },
    },
    servers: [
      { url: 'http://localhost:3000/api', description: 'Development' },
      { url: 'https://appointment-booking-system-1-pf41.onrender.com/api', description: 'Production' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            full_name: { type: 'string' },
            phone: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'user'] },
            avatar_url: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Appointment: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            appointment_date: { type: 'string', format: 'date' },
            appointment_time: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'approved', 'rejected', 'cancelled'] },
            file_url: { type: 'string' },
            notes: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
