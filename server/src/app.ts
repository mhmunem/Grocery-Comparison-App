import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import corsMiddleware from './middlewares/corsMiddleware';
import bodyParserMiddleware from './middlewares/bodyParserMiddleware';
import errorHandler from './middlewares/errorHandler';
import routes from './routes/initialsetup';
import db from './db/connection/pool';
import productsRouter from './api/products';
import { chains } from './db/schema/products';

const app = express();

const swagger_options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Grocery Comparison API',
      version: '1.0.0',
      description: 'API documentation for the Grocery Comparison server',
    },
  },
  apis: ['./src/routes/initialsetup.ts'],
};

const specs = swaggerJsdoc(swagger_options);

corsMiddleware(app);
bodyParserMiddleware(app);

// Database connection check
db.execute('SELECT NOW()')
  .then(() => console.log('Database connection is working'))
  .catch((err) => console.error('Database connection check failed:', err));

const output = async () => {
  console.log(await db.select().from(chains))
  // console.log(result);
};

output()

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/', routes);

app.use('/api/products', productsRouter);

app.use(errorHandler);

export default app;
