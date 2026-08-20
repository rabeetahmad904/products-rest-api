import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import productRoutes from '../src/routes/productRoutes.js';
import { swaggerSpec } from '../src/config/swagger.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/products', productRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Products REST API is active',
    documentation: '/docs'
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;