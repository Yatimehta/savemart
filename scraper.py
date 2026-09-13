#!/usr/bin/env python3
"""
Sabziwala.dk Product Scraper
Scrapes all products and categories from https://www.sabziwala.dk/denmark/
Outputs structured JSON and CSV files ready for web development.
"""

import os
import json
import csv
import re
import html
import time
import urllib.request
import urllib.error

BASE_URL = "https://www.sabziwala.dk/wp-json/wc/store/v1"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json",
}

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(OUTPUT_DIR, exist_ok=True)


def clean_html(raw_html):
    """Strip HTML tags and unescape HTML entities to get clean text."""
    if not raw_html:
        return ""
    clean = re.sub(r"<[^>]+>", " ", raw_html)
    clean = html.unescape(clean)
    return " ".join(clean.split())


def fetch_url(url, retries=3, delay=1.5):
    """Fetch URL with retries and delay."""
    req = urllib.request.Request(url, headers=HEADERS)
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                total_items = response.headers.get("X-WP-Total")
                total_pages = response.headers.get("X-WP-TotalPages")
                body = response.read().decode("utf-8")
                return json.loads(body), total_items, total_pages
        except Exception as e:
            print(f"  Attempt {attempt + 1}/{retries} failed for {url}: {e}")
            if attempt < retries - 1:
                time.sleep(delay * (attempt + 1))
            else:
                raise


def parse_price(price_str, minor_unit=2):
    """Parse integer minor unit string (e.g. '9000') into float (90.00)."""
    if not price_str:
        return 0.0
    try:
        val = float(price_str)
        return round(val / (10 ** minor_unit), 2)
    except (ValueError, TypeError):
        return 0.0


def scrape_categories():
    print("[1/2] Scraping categories...")
    categories = []
    page = 1
    while True:
        url = f"{BASE_URL}/products/categories?per_page=50&page={page}"
        try:
            data, _, _ = fetch_url(url)
            if not data:
                break
            for cat in data:
                categories.append({
                    "id": cat.get("id"),
                    "name": html.unescape(cat.get("name", "")),
                    "slug": cat.get("slug", ""),
                    "description": clean_html(cat.get("description", "")),
                    "parent": cat.get("parent", 0),
                    "count": cat.get("count", 0),
                    "permalink": cat.get("permalink", ""),
                    "image": cat.get("image", {}).get("src") if cat.get("image") else None
                })
            print(f"  Fetched page {page} ({len(data)} categories)")
            page += 1
        except urllib.error.HTTPError as e:
            if e.code in (400, 404):
                break
            raise
        except Exception as e:
            print(f"  Stopped categories fetch at page {page}: {e}")
            break

    cat_file = os.path.join(OUTPUT_DIR, "categories.json")
    with open(cat_file, "w", encoding="utf-8") as f:
        json.dump(categories, f, indent=2, ensure_ascii=False)
    print(f"  ✓ Saved {len(categories)} categories to {cat_file}")
    return categories


def scrape_products():
    print("\n[2/2] Scraping products...")
    # First get total pages
    url_p1 = f"{BASE_URL}/products?per_page=100&page=1"
    first_batch, total_items, total_pages = fetch_url(url_p1)
    
    total_pages_count = int(total_pages) if total_pages else 11
    print(f"  Detected {total_items or 'unknown'} total products across {total_pages_count} pages.")

    all_raw_products = list(first_batch)
    print(f"  Fetched page 1/{total_pages_count} ({len(first_batch)} products)")

    for page in range(2, total_pages_count + 1):
        page_url = f"{BASE_URL}/products?per_page=100&page={page}"
        try:
            batch, _, _ = fetch_url(page_url)
            if not batch:
                break
            all_raw_products.extend(batch)
            print(f"  Fetched page {page}/{total_pages_count} ({len(batch)} products)")
            time.sleep(0.3)
        except Exception as e:
            print(f"  Error fetching page {page}: {e}")

    print(f"\nProcessing {len(all_raw_products)} products...")
    cleaned_products = []

    for item in all_raw_products:
        prices = item.get("prices", {})
        minor_unit = prices.get("currency_minor_unit", 2)
        price = parse_price(prices.get("price"), minor_unit)
        reg_price = parse_price(prices.get("regular_price"), minor_unit)
        sale_price = parse_price(prices.get("sale_price"), minor_unit)
        currency = prices.get("currency_code", "DKK")
        currency_symbol = prices.get("currency_symbol", "kr.")

        raw_desc = item.get("description", "")
        raw_short_desc = item.get("short_description", "")
        clean_desc = clean_html(raw_desc)
        clean_short_desc = clean_html(raw_short_desc)

        images = item.get("images", [])
        image_urls = [img.get("src") for img in images if img.get("src")]
        primary_image = image_urls[0] if image_urls else None

        cats = item.get("categories", [])
        cat_names = [html.unescape(c.get("name", "")) for c in cats]
        cat_slugs = [c.get("slug", "") for c in cats]
        main_cat = cat_names[0] if cat_names else "Uncategorized"

        cleaned = {
            "id": item.get("id"),
            "name": html.unescape(item.get("name", "")),
            "slug": item.get("slug", ""),
            "permalink": item.get("permalink", ""),
            "sku": item.get("sku", "") or "",
            "price": price,
            "regular_price": reg_price,
            "sale_price": sale_price if item.get("on_sale") else None,
            "on_sale": bool(item.get("on_sale", False)),
            "currency": currency,
            "currency_symbol": currency_symbol,
            "in_stock": bool(item.get("is_in_stock", True)),
            "is_purchasable": bool(item.get("is_purchasable", True)),
            "description": clean_desc,
            "description_html": raw_desc,
            "short_description": clean_short_desc,
            "primary_image": primary_image,
            "images": image_urls,
            "main_category": main_cat,
            "categories": cat_names,
            "category_details": [{"id": c.get("id"), "name": html.unescape(c.get("name", "")), "slug": c.get("slug", "")} for c in cats],
            "average_rating": float(item.get("average_rating", 0) or 0),
            "review_count": int(item.get("review_count", 0) or 0),
        }
        cleaned_products.append(cleaned)

    # Save data/products.json
    products_json_file = os.path.join(OUTPUT_DIR, "products.json")
    with open(products_json_file, "w", encoding="utf-8") as f:
        json.dump(cleaned_products, f, indent=2, ensure_ascii=False)
    print(f"  ✓ Saved {len(cleaned_products)} products to {products_json_file}")

    # Save data/sample_products.json (first 12 products for quick mock/dev)
    sample_file = os.path.join(OUTPUT_DIR, "sample_products.json")
    with open(sample_file, "w", encoding="utf-8") as f:
        json.dump(cleaned_products[:12], f, indent=2, ensure_ascii=False)
    print(f"  ✓ Saved 12 sample products to {sample_file}")

    # Save data/products.csv
    products_csv_file = os.path.join(OUTPUT_DIR, "products.csv")
    csv_columns = [
        "id", "name", "slug", "price", "regular_price", "sale_price", "on_sale",
        "currency", "currency_symbol", "in_stock", "main_category", "categories",
        "primary_image", "images", "sku", "average_rating", "review_count",
        "permalink", "short_description", "description"
    ]
    with open(products_csv_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=csv_columns)
        writer.writeheader()
        for p in cleaned_products:
            row = {
                "id": p["id"],
                "name": p["name"],
                "slug": p["slug"],
                "price": p["price"],
                "regular_price": p["regular_price"],
                "sale_price": p["sale_price"] or "",
                "on_sale": p["on_sale"],
                "currency": p["currency"],
                "currency_symbol": p["currency_symbol"],
                "in_stock": p["in_stock"],
                "main_category": p["main_category"],
                "categories": "; ".join(p["categories"]),
                "primary_image": p["primary_image"] or "",
                "images": " | ".join(p["images"]),
                "sku": p["sku"],
                "average_rating": p["average_rating"],
                "review_count": p["review_count"],
                "permalink": p["permalink"],
                "short_description": p["short_description"],
                "description": p["description"],
            }
            writer.writerow(row)
    print(f"  ✓ Saved CSV export to {products_csv_file}")

    # Generate Summary statistics
    in_stock_count = sum(1 for p in cleaned_products if p["in_stock"])
    on_sale_count = sum(1 for p in cleaned_products if p["on_sale"])
    with_images_count = sum(1 for p in cleaned_products if p["primary_image"])
    
    cat_counts = {}
    for p in cleaned_products:
        for c in p["categories"]:
            cat_counts[c] = cat_counts.get(c, 0) + 1

    summary = {
        "source": "https://www.sabziwala.dk/denmark/",
        "scraped_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "total_products": len(cleaned_products),
        "in_stock_count": in_stock_count,
        "out_of_stock_count": len(cleaned_products) - in_stock_count,
        "on_sale_count": on_sale_count,
        "products_with_images": with_images_count,
        "total_unique_categories": len(cat_counts),
        "top_categories": sorted(cat_counts.items(), key=lambda x: x[1], reverse=True)[:15],
        "price_stats": {
            "min_price": min(p["price"] for p in cleaned_products) if cleaned_products else 0,
            "max_price": max(p["price"] for p in cleaned_products) if cleaned_products else 0,
            "currency": "DKK"
        }
    }

    summary_file = os.path.join(OUTPUT_DIR, "summary.json")
    with open(summary_file, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    print(f"  ✓ Saved summary stats to {summary_file}")

    return cleaned_products, summary


if __name__ == "__main__":
    start_time = time.time()
    scrape_categories()
    products, summary = scrape_products()
    elapsed = round(time.time() - start_time, 2)
    print(f"\n==========================================")
    print(f" Scraping complete in {elapsed} seconds!")
    print(f" Total Products: {summary['total_products']}")
    print(f" In Stock: {summary['in_stock_count']}")
    print(f" With Images: {summary['products_with_images']}")
    print(f" Output files located in: {OUTPUT_DIR}")
    print(f"==========================================")
