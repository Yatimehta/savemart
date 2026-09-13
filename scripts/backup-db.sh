#!/usr/bin/env bash
set -e

# Configuration
BACKUP_DIR="/var/backups/savemart"
DB_NAME="savemart_db"
DB_USER="savemart_user"
DATE=$(date +"%Y-%m-%d_%H%M%S")
FILENAME="$BACKUP_DIR/savemart_backup_$DATE.sql.gz"

mkdir -p "$BACKUP_DIR"

# Perform compressed PostgreSQL dump
echo "[$(date)] Starting PostgreSQL backup for $DB_NAME..."
pg_dump -U "$DB_USER" -h localhost "$DB_NAME" | gzip > "$FILENAME"

echo "[$(date)] Backup completed: $FILENAME ($(du -h "$FILENAME" | cut -f1))"

# Keep last 7 days of backups, delete older ones
find "$BACKUP_DIR" -name "savemart_backup_*.sql.gz" -mtime +7 -delete

echo "[$(date)] Old backups purged. Backup retention cycle finished."
