import { products } from '../data/products.js';

export const getAllProducts = (req, res) => {
  const { category } = req.query;
  if (category) {
    const filtered = products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
    return res.status(200).json({ success: true, data: filtered });
  }
  res.status(200).json({ success: true, data: products });
};

export const getProductById = (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.status(200).json({ success: true, data: product });
};

export const createProduct = (req, res) => {
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
  res.status(201).json({ success: true, data: newProduct });
};

export const updateProduct = (req, res) => {
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

  res.status(200).json({ success: true, data: products[index] });
};

export const deleteProduct = (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  products.splice(index, 1);
  res.status(200).json({ success: true, message: 'Product successfully deleted' });
};