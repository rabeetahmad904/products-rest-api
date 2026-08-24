import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Mock Data
let products = [
  {
    id: "1",
    name: "Wireless Ergonomic Mouse",
    category: "Electronics",
    price: 49.99,
    stock: 25,
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "Mechanical Gaming Keyboard",
    category: "Electronics",
    price: 89.99,
    stock: 12,
    createdAt: new Date().toISOString()
  }
];

// Controllers
const getAllProducts = (req, res) => {
  const { category } = req.query;
  if (category) {
    const filtered = products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
    return res.status(200).json({ success: true, data: filtered });
  }
  return res.status(200).json({ success: true, data: products });
};

const getProductById = (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  return res.status(200).json({ success: true, data: product });
};

const createProduct = (req, res) => {
  const { name, category, price, stock } = req.body;
  if (!name || !category || price === undefined || stock === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Name, category, price, and stock are required'
    });
  }

  const newProduct = {
    id: String(Date.now()),
    name,
    category,
    price: Number(price),
    stock: Number(stock),
    createdAt: new Date().toISOString()
  };

  products.push(newProduct);
  return res.status(201).json({ success: true, data: newProduct });
};

const updateProduct = (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const { name, category, price, stock } = req.body;
  products[index] = {
    ...products[index],
    ...(name && { name }),
    ...(category && { category }),
    ...(price !== undefined && { price: Number(price) }),
    ...(stock !== undefined && { stock: Number(stock) }),
    updatedAt: new Date().toISOString()
  };

  return res.status(200).json({ success: true, data: products[index] });
};

const deleteProduct = (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  products.splice(index, 1);
  return res.status(200).json({ success: true, message: 'Product successfully deleted' });
};

// Direct Inline OpenAPI Specification
const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Products REST API Service',
    version: '1.0.0',
    description: 'Stateless CRUD API for product management with Express'
  },
  servers: [{ url: '/' }],
  paths: {
    '/api/v1/products': {
      get: { summary: 'Get all products', responses: { '200': { description: 'Success' } } },
      post: { summary: 'Create product', responses: { '201': { description: 'Created' } } }
    },
    '/api/v1/products/{id}': {
      get: { summary: 'Get product by ID', responses: { '200': { description: 'Success' }, '404': { description: 'Not found' } } },
      put: { summary: 'Update product', responses: { '200': { description: 'Updated' } } },
      delete: { summary: 'Delete product', responses: { '200': { description: 'Deleted' } } }
    }
  }
};

// Serve JSON Spec
app.get('/swagger.json', (req, res) => {
  res.status(200).json(swaggerSpec);
});

// Serve CDN HTML Swagger UI
app.get('/docs', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Products API Documentation</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.min.css" />
    </head>
    <body style="margin:0; background:#fafafa;">
      <div id="swagger-ui"></div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-bundle.min.js"></script>
      <script>
        window.onload = () => {
          SwaggerUIBundle({
            url: '/swagger.json',
            dom_id: '#swagger-ui',
          });
        };
      </script>
    </body>
    </html>
  `);
});

// Routes
const router = express.Router();
router.route('/').get(getAllProducts).post(createProduct);
router.route('/:id').get(getProductById).put(updateProduct).delete(deleteProduct);

app.use('/api/v1/products', router);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Products REST API is active',
    documentation: '/docs'
  });
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;