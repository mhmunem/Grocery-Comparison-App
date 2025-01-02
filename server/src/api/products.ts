import express, { Request, Response } from 'express';
import { Product } from '../types/product'; // Import the Product type

const router = express.Router();

// Fetch products with name filtering and sorting by price
router.get('/sort-by-price', async (req: Request, res: Response) => {
    const { name, sort } = req.query; // Extract 'name' and 'sort' from query parameters

    try {
        // Base query
        let query = 'SELECT * FROM products';
        const values: string[] = [];

        // Filter by product name if provided
        if (name) {
            query += ' WHERE LOWER(product_name) LIKE $1';
            values.push(`%${(name as string).toLowerCase()}%`);
        }

        // Add sorting condition
        if (sort === 'asc') {
            query += values.length ? ' ORDER BY price ASC' : ' WHERE TRUE ORDER BY price ASC';
        } else if (sort === 'desc') {
            query += values.length ? ' ORDER BY price DESC' : ' WHERE TRUE ORDER BY price DESC';
        } else {
            // Default to ascending if no sort parameter is provided
            query += values.length ? ' ORDER BY price ASC' : ' WHERE TRUE ORDER BY price ASC';
        }

        // Execute the query
        //const result = await pool.query<Product>(query, values);

        // Send the response
        //res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;

