#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://savemart_user:SaveMartProductionPassword2026!@localhost:5432/savemart_db';

const pool = new Pool({
  connectionString,
});

async function main() {
  console.log('Connecting to PostgreSQL...');
  const client = await pool.connect();
  try {
    console.log('Running schema migrations...');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await client.query(schemaSql);
    console.log('✓ Schema applied successfully.');

    // 1. Seed Categories
    const catFile = path.join(__dirname, '..', 'data', 'categories.json');
    if (fs.existsSync(catFile)) {
      const cats = JSON.parse(fs.readFileSync(catFile, 'utf-8'));
      console.log(`Seeding ${cats.length} categories...`);
      for (const cat of cats) {
        await client.query(
          `INSERT INTO categories (id, name, slug, count, parent, image)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (id) DO UPDATE SET
             name = EXCLUDED.name,
             slug = EXCLUDED.slug,
             count = EXCLUDED.count,
             parent = EXCLUDED.parent,
             image = EXCLUDED.image`,
          [cat.id, cat.name, cat.slug, cat.count || 0, cat.parent || 0, cat.image || null]
        );
      }
      console.log('✓ Categories seeded.');
    }

    // 2. Seed Products
    const prodFile = path.join(__dirname, '..', 'data', 'products.json');
    if (fs.existsSync(prodFile)) {
      const prods = JSON.parse(fs.readFileSync(prodFile, 'utf-8'));
      console.log(`Seeding ${prods.length} products...`);
      for (const prod of prods) {
        await client.query(
          `INSERT INTO products (
            id, name, slug, main_category, categories, price, regular_price,
            on_sale, in_stock, stock_status, image, images, description, sku,
            unit, currency, currency_symbol
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            slug = EXCLUDED.slug,
            main_category = EXCLUDED.main_category,
            categories = EXCLUDED.categories,
            price = EXCLUDED.price,
            regular_price = EXCLUDED.regular_price,
            on_sale = EXCLUDED.on_sale,
            in_stock = EXCLUDED.in_stock,
            stock_status = EXCLUDED.stock_status,
            image = EXCLUDED.image,
            images = EXCLUDED.images,
            description = EXCLUDED.description,
            sku = EXCLUDED.sku,
            unit = EXCLUDED.unit,
            currency = EXCLUDED.currency,
            currency_symbol = EXCLUDED.currency_symbol`,
          [
            prod.id,
            prod.name,
            prod.slug || `prod-${prod.id}`,
            prod.main_category || '',
            JSON.stringify(prod.categories || []),
            prod.price || 0,
            prod.regular_price || null,
            prod.on_sale || false,
            prod.in_stock !== false,
            prod.stock_status || 'instock',
            prod.image || null,
            JSON.stringify(prod.images || []),
            prod.description || '',
            prod.sku || '',
            prod.unit || 'Standard',
            prod.currency || 'DKK',
            prod.currency_symbol || 'kr.',
          ]
        );
      }
      console.log('✓ Products seeded successfully into PostgreSQL.');
    }

    // Set auto-increment sequence correctly
    await client.query(`SELECT setval('products_id_seq', (SELECT COALESCE(MAX(id), 1) FROM products));`);
    await client.query(`SELECT setval('categories_id_seq', (SELECT COALESCE(MAX(id), 1) FROM categories));`);

    console.log('Database initialization & seeding completed successfully!');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Error during database seed:', err);
  process.exit(1);
});
