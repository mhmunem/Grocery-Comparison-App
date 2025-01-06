import bodyParserMiddleware from './middlewares/bodyParserMiddleware'
import corsMiddleware from './middlewares/corsMiddleware'
import db from './db/connection/pool'
import errorHandler from './middlewares/errorHandler'
import express from 'express'
import routes from './routes/initialsetup'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

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
    apis: ['./src/routes/initialsetup.ts'],
}

const specs = swaggerJsdoc(options)

corsMiddleware(app)
bodyParserMiddleware(app)

// Database connection check
db.execute('SELECT NOW()')
    .then(() => console.log('Database connection is working'))
    .catch((err) => console.error('Database connection check failed:', err))

// BUG: page is empty
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

app.use('/', routes)

// TODO: get search working
// https://expressjs.com/en/guide/routing.html#route-parameters
// https://stackoverflow.com/questions/69185028/how-to-send-url-params-from-react-to-express-api-call
// SEARCH_PRODUCT: "/search_product?name=:name",
app.use('/search_product', routes)

app.use(errorHandler)

export default app
