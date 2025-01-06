import router from "./initialsetup";
import { search_product } from "../search/search";
import { Request, Response } from 'express';
import db from "../db/connection/pool";

router.get('/search', (req: Request<{ name: string, sort_by: "name" | "price" | "amount", sort_direction: "ASC" | "DESC" }>, res: Response) => {
    res.send(
        search_product(db, req.params.name, req.params.sort_by, req.params.sort_direction)
    )
});
