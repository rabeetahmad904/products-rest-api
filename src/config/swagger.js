import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Products REST API Service',
      version: '1.0.0',
      description: 'Stateless CRUD API for product management with Express'
    },
    servers: [
      {
        url: '/',
        description: 'Current Environment'
      }
    ],
    paths: {
      '/api/v1/products': {
        get: {
          summary: 'Get all products',
          responses: {
            '200': { description: 'Successful request' }
          }
        },
        post: {
          summary: 'Create a new product',
          responses: {
            '201': { description: 'Product created successfully' }
          }
        }
      },
      '/api/v1/products/{id}': {
        get: {
          summary: 'Get product by ID',
          responses: {
            '200': { description: 'Successful request' },
            '404': { description: 'Product not found' }
          }
        },
        put: {
          summary: 'Update product',
          responses: {
            '200': { description: 'Product updated successfully' }
          }
        },
        delete: {
          summary: 'Delete product',
          responses: {
            '200': { description: 'Product deleted successfully' }
          }
        }
      }
    }
  },
  apis: [] // Keep empty to avoid Vercel filesystem runtime errors
};

export const swaggerSpec = swaggerJSDoc(options);