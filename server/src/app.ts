import bodyParser from 'body-parser'
import categoryRouter from './routes/categoryRouter'
import cors from 'cors'
import db from './db/connection/pool'
import errorHandler from './middlewares/errorHandler'
import express from 'express'
import priceHistoryRouter from "./routes/priceHistoryRouter"
import routes from './routes/initialsetup'
import searchRouter from "./routes/searchRouter"
import storesRouter from './routes/storesRouter'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const app = express()

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Grocery Comparison API",
            version: "1.0.0",
            description: "API documentation for the Grocery Comparison server",
        },
    },
    apis: ["./src/routes/*"],
}

const specs = swaggerJsdoc(options)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

app.use("/",
    routes,
    storesRouter,
    categoryRouter,
    searchRouter,
    priceHistoryRouter
)

app.use(cors())
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.use(errorHandler)

db.execute("SELECT NOW()")
    .then(() => console.log("Database connection is successful"))
    .catch((err) => console.error("Database connection check failed:", err))

const PORT = Number(process.env["PORT"])

let server = app.listen(PORT, "0.0.0.0", () => {
    console.log("Server is running in environment:", process.env["NODE_ENV"])
    console.log(`Server is running on port ${PORT}`)
})

process.on("SIGTERM", () => {
    console.log("SIGTERM signal received: closing HTTP server")
    server.close(() => {
        console.log("HTTP server closed")
    })
})
