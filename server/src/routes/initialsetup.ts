import express from 'express';
import { search_product } from "../search/search";
import { Request, Response } from 'express';
import db from "../db/connection/pool";


const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     description: Welcome message
 *     responses:
 *       200:
 *         description: Welcome to the Grocery Comparison
 */
router.get('/', (req, res) => {
    console.log('welcome');

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
router.get('/initialSetup', (req, res) => {
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
router.post('/initialSetup', (req, res) => {
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

router.get('/search_product', (req: Request<{ name: string, sort_by: "name" | "price" | "amount", sort_direction: "ASC" | "DESC" }>, res: Response) => {
    console.log('doing get search!!!!!')

    res.send(
        search_product(db, req.params.name, req.params.sort_by, req.params.sort_direction)
    )
});

export default router;
