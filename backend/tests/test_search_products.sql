CREATE OR REPLACE FUNCTION test_search_products()
RETURNS SETOF TEXT AS $$
DECLARE
    test_result boolean;
BEGIN
    -- Setup test data
    CREATE TEMPORARY TABLE test_products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        price DECIMAL(10,2),
        amount INTEGER
    );

    INSERT INTO test_products (name, price, amount) VALUES
        ('Table Lamp', 29.99, 10),
        ('Coffee Table', 149.99, 5),
        ('Dining Table', 299.99, 3),
        ('Night Table', 79.99, 8),
        ('Tablet Stand', 19.99, 15),
        ('Chair', 59.99, 12),
        ('Sofa', 499.99, 2),
        ('Desk', 199.99, 4),
        ('Bookshelf', 89.99, 6),
        ('Cabinet', 249.99, 3);

    -- Test trigram similarity
    test_result := (SELECT COUNT(*) > 0 FROM search_products('Tabel', 0.2, 'name', 'ASC', 'trigram'));
    IF NOT test_result THEN
        RETURN NEXT 'FAIL: Trigram should find misspelled "Table"';
    ELSE
        RETURN NEXT 'PASS: Trigram found misspelled "Table"';
    END IF;

    -- Test Levenshtein
    test_result := (SELECT COUNT(*) > 0 FROM search_products('Chair', 0.1, 'name', 'ASC', 'levenshtein'));
    IF NOT test_result THEN
        RETURN NEXT 'FAIL: Levenshtein should find "Chair"';
    ELSE
        RETURN NEXT 'PASS: Levenshtein found "Chair"';
    END IF;

    -- Test combined search
    test_result := (
        SELECT COUNT(*) >= (
            SELECT COUNT(*) FROM search_products('Tabel', 0.3, 'name', 'ASC', 'trigram')
        )
        FROM search_products('Tabel', 0.3, 'name', 'ASC', 'combined')
    );
    IF NOT test_result THEN
        RETURN NEXT 'FAIL: Combined search should find at least as many results as trigram alone';
    ELSE
        RETURN NEXT 'PASS: Combined search found expected results';
    END IF;

    -- Test different thresholds
    test_result := (
        SELECT COUNT(*) < (
            SELECT COUNT(*) FROM search_products('Table', 0.3, 'name', 'ASC', 'trigram')
        )
        FROM search_products('Table', 0.8, 'name', 'ASC', 'trigram')
    );
    IF NOT test_result THEN
        RETURN NEXT 'FAIL: Higher threshold should return fewer results';
    ELSE
        RETURN NEXT 'PASS: Threshold filtering working correctly';
    END IF;

    -- Test invalid search method
    BEGIN
        PERFORM search_products('table', 0.3, 'name', 'ASC', 'invalid_method');
        RETURN NEXT 'FAIL: Should raise exception for invalid search method';
    EXCEPTION WHEN OTHERS THEN
        RETURN NEXT 'PASS: Correctly raised exception for invalid search method';
    END;

    -- Cleanup
    DROP TABLE test_products;

    RETURN NEXT 'All tests completed!';
END;
$$ LANGUAGE plpgsql;

-- Run the tests
SELECT * FROM test_search_products();


