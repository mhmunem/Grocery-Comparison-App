"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pool_1 = __importDefault(require("../../../db/pool")); // Adjust relative path to DB folder
const router = express_1.default.Router();
// Fetch products with name filtering and sorting by price
router.get('/sort-by-price', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, sort } = req.query; // Extract 'name' and 'sort' from query parameters
    try {
        // Base query
        let query = 'SELECT * FROM products';
        const values = [];
        // Filter by product name if provided
        if (name) {
            query += ' WHERE LOWER(product_name) LIKE $1';
            values.push(`%${name.toLowerCase()}%`);
        }
        // Add sorting condition
        if (sort === 'asc') {
            query += values.length ? ' ORDER BY price ASC' : ' WHERE TRUE ORDER BY price ASC';
        }
        else if (sort === 'desc') {
            query += values.length ? ' ORDER BY price DESC' : ' WHERE TRUE ORDER BY price DESC';
        }
        else {
            // Default to ascending if no sort parameter is provided
            query += values.length ? ' ORDER BY price ASC' : ' WHERE TRUE ORDER BY price ASC';
        }
        // Execute the query
        const result = yield pool_1.default.query(query, values);
        // Send the response
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = router;
