import swaggerJsdoc from 'swagger-jsdoc'
import { env } from '../config/env.js'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Career Toolkit API',
      version: '1.0.0',
      description: 'Backend API for Career Toolkit — auth, resume tools, and more.',
    },
    servers: [{ url: `http://localhost:${env.port}`, description: 'Development' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
}

export const swaggerSpec = swaggerJsdoc(options)
