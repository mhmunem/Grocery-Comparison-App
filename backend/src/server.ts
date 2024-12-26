import express from 'express';
import cors from 'cors';
import productsRouter from './api/products';

const app = express();
app.use(cors());
app.use(express.json());

// Register the product API
app.use('/api/products', productsRouter);

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

