#!/bin/bash

DB_HOST="$1"
DB_PORT="$2"
DB_NAME="$3"
DB_PASSWORD="$4"
DB_CONN="host=$DB_HOST.postgres.database.azure.com port=$DB_PORT dbname=$DB_NAME user=wlemp@zatchat-db password=$DB_PASSWORD sslmode=require"
MIGRATIONS_DIR="./prisma/migrations"

for file in $(find "$MIGRATIONS_DIR" -name "migration.sql" | sort); do
    echo "Applying migration: $file"
    PGPASSWORD="$DB_PASSWORD" psql "$DB_CONN" -f "$file"
    if [ $? -ne 0 ]; then
        echo "Failed to apply migration: $file"
        exit 1
    fi
done

echo "All migrations applied successfully!"
