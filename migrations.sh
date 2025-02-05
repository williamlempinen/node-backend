#!/bin/bash

DB_URL="$1"
MIGRATIONS_DIR="./prisma/migrations"

if [[ -z "$DB_URL" ]]; then
    echo "Usage: $0 <database_url>"
    exit 1
fi

for file in $(find "$MIGRATIONS_DIR" -name "migration.sql" | sort); do
    echo "Applying migration: $file"
    PGPASSWORD=$(echo "$DB_URL" | sed -n 's/.*password=\([^ ]*\).*/\1/p') \
    psql "$DB_URL" -f "$file"

    if [ $? -ne 0 ]; then
        echo "Failed to apply migration: $file"
        exit 1
    fi
done

echo "All migrations applied successfully!"
