#!/bin/bash
set -e
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE task_db;
    CREATE DATABASE audit_db;
    CREATE DATABASE auth_db;
EOSQL
