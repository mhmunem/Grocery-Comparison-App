import cors from 'cors';
import { Application } from 'express';

const allowedOrigins = [
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'http://localhost:5173',
  'http://localhost:8100',
  '*',
];

const corsMiddleware = (app: Application) => {
  app.use(cors({
    origin: allowedOrigins,
  }));
};

export default corsMiddleware;