import db from "../../db/connection/pool";
import { chains } from "../../db/schema/chains";
import { stores } from "../../db/schema/stores";
import { ilike } from "drizzle-orm";

const insertOrUpdateStores = async (storeData: any) => {
    try {
        //const allChains = await db.select().from(chains);

        for (const store of storeData) {
            if (store.name) {
                const chain = await db.select().from(chains).where(ilike(chains.name, `${store.name.split(' ')[0]}%`)).limit(1);
                //console.log(chain)
                if (chain) {
                    await db.insert(stores).values({
                        name: store.name,
                        chainID: chain[0].id,
                    }).onConflictDoUpdate({
                        target: [stores.name],
                        set: {
                            chainID: chain[0].id,
                        },
                    });

                    console.log(`Inserted or updated ${store.name} successfully.`);
                } else {
                    console.error(`No matching chain found for: ${store.name}`);
                }
            } else {
                console.error("Store name is undefined");
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

export default insertOrUpdateStores;