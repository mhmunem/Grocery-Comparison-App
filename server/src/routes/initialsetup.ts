import { Router } from 'express';
import { search_product } from "../search/search";
import { Request, Response } from 'express';
import db from "../db/connection/pool";
import { SortDirection } from '../types/routes';
import { SortBy } from '../types/routes';


const router = Router()

/**
 * @swagger
 * /:
 *   get:
 *     description: Welcome message
 *     responses:
 *       200:
 *         description: Welcome to the Grocery Comparison
 */
router.get('/', (_, res) => {
    res.send('Welcome to the Grocery Comparison from server!');
});

/**
 * @swagger
 * /initialSetup:
 *   get:
 *     description: Test GET request
 *     responses:
 *       200:
 *         description: GET is working.
 */
router.get('/initialSetup', (_, res) => {
    res.send('GET is working.');
});

/**
 * @swagger
 * /initialSetup:
 *   post:
 *     description: Test POST request
 *     responses:
 *       200:
 *         description: POST is working.
 */
router.post('/initialSetup', (_, res) => {
    res.send('POST is working.');
});

/**
 * @swagger
 * /initialSetup/{id}:
 *   put:
 *     description: Update a resource by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the resource to update
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PUT is working for the specified ID
 */
router.put('/initialSetup/:id', (req, res) => {
    res.send(`PUT is working for ID: ${req.params.id} `);
});

/**
 * @swagger
 * /initialSetup/{id}:
 *   delete:
 *     description: Delete a resource by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the resource to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: DELETE is working for the specified ID
 */
router.delete('/initialSetup/:id', (req, res) => {
    res.send(`DELETE is working for ID: ${req.params.id} `);
});

/**
 * @swagger
 * /search_product:
 *   get:
 *     summary: Search for a product
 *     description: Retrieves a list of products filtered by name and sorted by the specified criteria.
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the product to search for.
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [name, price, amount]
 *         required: false
 *         description: The field by which to sort the results.
 *       - in: query
 *         name: sort_direction
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         required: false
 *         description: The direction to sort the results (ascending or descending).
 *     responses:
 *       200:
 *         description: A list of products matching the search criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier of the product.
 *                   name:
 *                     type: string
 *                     description: The name of the product.
 *                   price:
 *                     type: number
 *                     format: float
 *                     description: The price of the product.
 *                   amount:
 *                     type: integer
 *                     description: The available amount of the product.
 *       400:
 *         description: Invalid request parameters.
 */
router.get('/search_product', async (req: Request<{ name: string, sort_by: SortBy, sort_direction: SortDirection }>, res: Response) => {
    const { name, sort_by, sort_direction } = req.query

    const result = await search_product(db, name as string, sort_by as SortBy, sort_direction as SortDirection)

    res.send(result)
});

export default router;
