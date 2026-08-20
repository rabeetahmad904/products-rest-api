import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Products REST API Service',
      version: '1.0.0',
      description: 'Stateless CRUD API for product management with Express'
    },
    servers: [{ url: '/' }]
  },
  apis: ['./src/routes/*.js', './api/index.js']
};

export const swaggerSpec = swaggerJSDoc(options);