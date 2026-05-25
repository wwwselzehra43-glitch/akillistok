# Database Schema - Akıllı Stok Takip

## Tables

### users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    household_code VARCHAR(10) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### households
```sql
CREATE TABLE households (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    owner_id INT NOT NULL REFERENCES users(id),
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### household_members
```sql
CREATE TABLE household_members (
    id SERIAL PRIMARY KEY,
    household_id INT NOT NULL REFERENCES households(id),
    user_id INT NOT NULL REFERENCES users(id),
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(household_id, user_id)
);
```

### categories
```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### products
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    household_id INT NOT NULL REFERENCES households(id),
    name VARCHAR(255) NOT NULL,
    category_id INT REFERENCES categories(id),
    barcode VARCHAR(50),
    image_url VARCHAR(500),
    current_quantity DECIMAL(10, 2) NOT NULL DEFAULT 0,
    usage_frequency VARCHAR(100),
    unit_price DECIMAL(10, 2),
    last_purchase_date TIMESTAMP,
    predicted_stockout_date TIMESTAMP,
    min_quantity DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### product_movements
```sql
CREATE TABLE product_movements (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id),
    movement_type VARCHAR(50) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    recorded_by INT NOT NULL REFERENCES users(id),
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### stores
```sql
CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(10, 8),
    address VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### price_records
```sql
CREATE TABLE price_records (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id),
    store_id INT NOT NULL REFERENCES stores(id),
    price DECIMAL(10, 2) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### shopping_lists
```sql
CREATE TABLE shopping_lists (
    id SERIAL PRIMARY KEY,
    household_id INT NOT NULL REFERENCES households(id),
    name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### shopping_list_items
```sql
CREATE TABLE shopping_list_items (
    id SERIAL PRIMARY KEY,
    shopping_list_id INT NOT NULL REFERENCES shopping_lists(id),
    product_id INT REFERENCES products(id),
    quantity DECIMAL(10, 2),
    is_purchased BOOLEAN DEFAULT FALSE,
    marked_by INT REFERENCES users(id),
    marked_at TIMESTAMP
);
```

### notifications
```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    household_id INT NOT NULL REFERENCES households(id),
    user_id INT REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    body TEXT,
    type VARCHAR(50),
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### push_tokens
```sql
CREATE TABLE push_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    token VARCHAR(500) NOT NULL,
    platform VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    last_used TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes

```sql
CREATE INDEX idx_products_household ON products(household_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_movements_product ON product_movements(product_id);
CREATE INDEX idx_prices_product_store ON price_records(product_id, store_id);
CREATE INDEX idx_shopping_items_list ON shopping_list_items(shopping_list_id);
CREATE INDEX idx_notifications_household ON notifications(household_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
```
