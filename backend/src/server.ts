import app from './app';
import dotenv from 'dotenv';

dotenv.config({
  path: '.env'
});

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on ${PORT}`);
});
