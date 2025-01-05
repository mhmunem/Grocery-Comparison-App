import { sql } from "drizzle-orm";
import db from "../connection/pool";

export async function store_search_products() {
    const stored_function = sql`
    -- Enable required extensions
    CREATE EXTENSION IF NOT EXISTS pg_trgm;
    CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS products_name_trgm_idx ON products USING gin (name gin_trgm_ops);
    CREATE INDEX IF NOT EXISTS products_name_btree_idx ON products USING btree (name);

    /*
    This function performs fuzzy text search on product names using multiple search methods:
    - trigram: finds similar text patterns (e.g., "tble" matches "table")
    - levenshtein: finds words with similar edit distance (e.g., "tabls" matches "table")
    - combined: uses all methods above

    Parameters:
    - search_term: the text to search for
    - similarity_threshold: how close the match needs to be (0.0 to 1.0, default 0.3)
    - sort_column: column to sort by (id, name, price, amount, default 'id')
    - sort_direction: ASC or DESC (default 'ASC')
    - search_method: which algorithm to use (trigram, levenshtein, metaphone, combined)

    Example usage:
    - Basic search: SELECT * FROM search_products('salt');
    - Fuzzy search with high similarity: SELECT * FROM search_products('salt', 0.8);
    - Sort by price: SELECT * FROM search_products('salt', 0.3, 'price', 'DESC');
    - Specific method: SELECT * FROM search_products('salt', 0.3, 'name', 'ASC', 'trigram');
    - Phonetic search: SELECT * FROM search_products('fone', 0.3, 'name', 'ASC', 'metaphone');
    */

    -- Drop is to make it easier to change the return type (if needed).
    DROP FUNCTION search_products(text,double precision,text,text,text);
    CREATE OR REPLACE FUNCTION search_products(
        search_term text,
        similarity_threshold float DEFAULT 0.3,
        sort_column text DEFAULT 'name',
        sort_direction text DEFAULT 'ASC',
        search_method text DEFAULT 'combined' -- 'combined', 'trigram', 'levenshtein'
    )
    RETURNS TABLE (
        product_id integer,
        product_name text,
        product_price decimal,
        product_amount numeric,
        image text,
        storeID integer,
        unitID integer
    )
    LANGUAGE plpgsql
    AS $$
    DECLARE
        query text;
        similarity text;
    BEGIN
        -- Validate inputs
        IF sort_column NOT IN ('name', 'price', 'amount', 'similarity') THEN
            RAISE EXCEPTION 'Invalid sort column. Must be one of: name, price, amount, similarity';
        END IF;

        IF upper(sort_direction) NOT IN ('ASC', 'DESC') THEN
            RAISE EXCEPTION 'Invalid sort direction. Must be either ASC or DESC';
        END IF;

        IF search_method NOT IN ('combined', 'trigram', 'levenshtein') THEN
            RAISE EXCEPTION 'Invalid search method. Must be one of: combined, trigram, levenshtein, metaphone';
        END IF;

        IF similarity_threshold < 0 OR similarity_threshold > 1 THEN
            RAISE EXCEPTION 'Similarity threshold must be between 0 and 1';
        END IF;

        query := '
                SELECT *
                FROM products 
                WHERE %s
                ORDER BY %s %s
        ';

        CASE search_method
        WHEN 'trigram' THEN
            similarity := 'similarity(lower(name), lower($1)) > $2';
        WHEN 'levenshtein' THEN
            similarity := 'levenshtein(lower(name), lower($1)) <= ceil(length($1) * (1 - $2))';
        ELSE -- 'combined'
            similarity := 'similarity(lower(name), lower($1)) > $2 OR levenshtein(lower(name), lower($1)) <= ceil(length($1) * (1 - $2))';
        END CASE;

        RETURN query EXECUTE format(query, similarity, sort_column, upper(sort_direction)) USING search_term, similarity_threshold;
    END;
    $$;
    `
    await db.execute(stored_function)
}
