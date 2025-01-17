import { category } from "../../db/schema/category";
import db from "../../db/connection/pool";
import categoriesUrl from "../constants/categoriesUrl";

const insertCategories = async (name: string) => {
    await db.insert(category)
        .values({ name: name })
        .onConflictDoUpdate({
            target: category.name,
            set: {
                name: category.name,
            },
        });
    console.log(`Inserted ${name} successfully.`);

};

export default insertCategories;
