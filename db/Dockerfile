FROM postgres:latest

ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV POSTGRES_DB=${POSTGRES_DB}

# COPY ./queries/init.sql /docker-entrypoint-initdb.d/init.sql
# COPY ./queries/migrations /docker-entrypoint-initdb.d/migrations/

EXPOSE 5432
