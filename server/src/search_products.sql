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

CREATE OR REPLACE FUNCTION search_products(
    search_term text,
    similarity_threshold float DEFAULT 0.3,
    sort_column text DEFAULT 'id',
    sort_direction text DEFAULT 'ASC',
    search_method text DEFAULT 'combined' -- 'combined', 'trigram', 'levenshtein', 'metaphone'
)
RETURNS TABLE (
    product_id integer,
    product_name varchar,
    product_price decimal,
    product_amount integer
)
LANGUAGE plpgsql
AS $$
DECLARE
    query text;
BEGIN
    -- Validate inputs
    IF sort_column NOT IN ('id', 'name', 'price', 'amount') THEN
        RAISE EXCEPTION 'Invalid sort column. Must be one of: id, name, price, amount, similarity';
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

    -- Build the query based on search method
    CASE search_method
        WHEN 'trigram' THEN
            query := '
                SELECT id, name, price, amount
                FROM products 
                WHERE similarity(name, $1) > $2
                ORDER BY %s %s';

        WHEN 'levenshtein' THEN
            query := '
                SELECT id, name, price, amount
                FROM products 
                WHERE levenshtein(lower(name), lower($1)) <= ceil(length($1) * (1 - $2))
                ORDER BY %s %s';

        ELSE -- 'combined'
            query := '
                SELECT DISTINCT id, name, price, amount
                FROM products 
                WHERE 
                    similarity(name, $1) > $2
                    OR levenshtein(lower(name), lower($1)) <= ceil(length($1) * (1 - $2))
                ORDER BY %s %s';
    END CASE;

    -- Add sorting
    RETURN QUERY EXECUTE format(
        query,
        CASE 
            WHEN sort_column = 'similarity' THEN
                CASE search_method
                    WHEN 'trigram' THEN 'similarity(name, $1)'
                    WHEN 'levenshtein' THEN '1.0 - (levenshtein(lower(name), lower($1))::float / greatest(length($1), length(name)))'
                    WHEN 'metaphone' THEN 'similarity(name, $1)' -- fallback to trigram for metaphone sorting
                    ELSE 'greatest(
                            similarity(name, $1),
                            1.0 - (levenshtein(lower(name), lower($1))::float / greatest(length($1), length(name)))
                         )'
                END
            ELSE sort_column
        END,
        upper(sort_direction)
    ) USING search_term, similarity_threshold;
END;
$$;

