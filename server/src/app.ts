import bodyParserMiddleware from './middlewares/bodyParserMiddleware'
import corsMiddleware from './middlewares/corsMiddleware'
import db from './db/connection/pool'
import errorHandler from './middlewares/errorHandler'
import express from 'express'
import routes from './routes/initialsetup'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import storesRouter from './routes/storesRouter'

const app = express()

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Grocery Comparison API',
            version: '1.0.0',
            description: 'API documentation for the Grocery Comparison server',
        },
    },
    apis: ['./src/routes/*'],
}

const specs = swaggerJsdoc(options)

corsMiddleware(app)
bodyParserMiddleware(app)

db.execute('SELECT NOW()')
    .then(() => console.log('Database connection is working'))
    .catch((err) => console.error('Database connection check failed:', err))

// BUG: page is empty
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

app.use('/', routes, storesRouter)
app.use('/search_product', routes)

app.use(errorHandler)

export default app
