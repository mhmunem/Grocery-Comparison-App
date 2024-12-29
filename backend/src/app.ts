import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import corsMiddleware from './middlewares/corsMiddleware';
import bodyParserMiddleware from './middlewares/bodyParserMiddleware';
import errorHandler from './middlewares/errorHandler';
import routes from './routes/initialsetup';
import db from './dbconnection/pool';

const app = express();

// Swagger definition
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Grocery Comparison API',
      version: '1.0.0',
      description: 'API documentation for the Grocery Comparison backend',
    },
  },
  apis: ['./src/routes/initialsetup.ts'], 
};

const specs = swaggerJsdoc(options);

// Middleware
corsMiddleware(app);
bodyParserMiddleware(app);

// Database connection check
db.execute('SELECT NOW()')
  .then(() => console.log('Database connection is working'))
  .catch((err) => console.error('Database connection check failed:', err));

// Setup Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/', routes);

// Error handling
app.use(errorHandler);

export default app;
