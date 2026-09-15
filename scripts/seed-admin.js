#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Support loading .env if available
try {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        if (!process.env[key]) {
          process.env[key] = value.trim();
        }
      }
    });
  }
} catch (e) {
  // ignore
}

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;

if (!adminEmail || !adminPassword) {
  console.error('❌ Error: Both ADMIN_EMAIL and ADMIN_INITIAL_PASSWORD environment variables must be set.');
  console.error('Example usage:');
  console.error('  ADMIN_EMAIL="admin@savemart.dk" ADMIN_INITIAL_PASSWORD="SecurePassword123!" npm run db:seed-admin');
  console.error('or ensure they are defined in your .env file.');
  process.exit(1);
}

const connectionString = process.env.DATABASE_URL || 'postgresql://savemart_user:SaveMartProductionPassword2026!@localhost:5432/savemart_db';

const pool = new Pool({
  connectionString,
});

async function main() {
  console.log('Connecting to PostgreSQL to seed admin user...');
  const client = await pool.connect();
  try {
    // 1. Ensure table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

    // 3. Upsert admin user
    const res = await client.query(
      `INSERT INTO admin_users (email, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (email)
       DO UPDATE SET password_hash = EXCLUDED.password_hash
       RETURNING id, email, created_at;`,
      [adminEmail.toLowerCase().trim(), passwordHash]
    );

    console.log(`✓ Admin user successfully configured: ${res.rows[0].email} (ID: ${res.rows[0].id})`);
    console.log('  Password safely hashed with bcrypt (never stored in plaintext).');
  } catch (err) {
    console.error('❌ Failed to seed admin user:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
