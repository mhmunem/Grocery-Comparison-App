export type Product = {
    products: {
        id: number;
        name: string;
        brand: string;
        details: string;
        amount: number;
        image: string;
        unitID: number;
        categoryID: number;
    };
    store_products: {
        id: number;
        storeID: number;
        productID: number;
        price: number;
    };
    stores: {
        id: number;
        name: string;
        chainID: number;
        id_store: number;
    };
    chains: {
        id: number;
        name: string;
        image_logo: string;
    };
    category:{
		id: number;
        name: string;
	}
};
