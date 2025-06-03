FROM library/postgres:17.4

COPY *.sql docker-entrypoint-initdb.d/
