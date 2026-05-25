# API Endpoints Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication

### POST /auth/register
Register a new user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:** 201 Created
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "household_code": "ABC123"
  }
}
```

### POST /auth/login
Login user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": { ... }
  }
}
```

---

## Products

### GET /products
Get all products in household

**Response:** 200 OK
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Süt",
      "category": "Süt Ürünleri",
      "quantity": 2,
      "usage_frequency": "Haftada 2",
      "predicted_stockout_date": "2024-02-15"
    }
  ]
}
```

### POST /products
Add new product

**Request:**
```json
{
  "name": "Kahve",
  "category_id": 2,
  "barcode": "123456789",
  "quantity": 1,
  "usage_frequency": "Ayda 1",
  "unit_price": 45.50
}
```

**Response:** 201 Created
```json
{
  "success": true,
  "data": { ... }
}
```

### PUT /products/:id
Update product

**Request:**
```json
{
  "quantity": 3,
  "usage_frequency": "Haftada 2"
}
```

### DELETE /products/:id
Delete product

**Response:** 204 No Content

---

## Dashboard

### GET /dashboard/items
Get dashboard items (urgent/warning/normal)

**Response:** 200 OK
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Süt",
      "days_left": 2,
      "percentage": 85,
      "category": "Süt Ürünleri"
    },
    {
      "id": 2,
      "name": "Kahve",
      "days_left": 5,
      "percentage": 65,
      "category": "İçecek"
    }
  ]
}
```

---

## Barcode

### GET /barcode/lookup/:barcode
Lookup product by barcode

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "name": "Türk Kahvesi",
    "category": "İçecek",
    "image_url": "https://..."
  }
}
```

---

## Shopping List

### GET /shopping-list
Get active shopping list

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "id": 1,
    "total_items": 5,
    "purchased_items": 2,
    "estimated_total": 145.50,
    "items": [
      {
        "id": 1,
        "product_name": "Süt",
        "quantity": 2,
        "is_purchased": false,
        "estimated_price": 30
      }
    ]
  }
}
```

### POST /shopping-list/generate
Generate smart shopping list

**Response:** 201 Created
```json
{
  "success": true,
  "data": {
    "id": 2,
    "items": [ ... ]
  }
}
```

### PUT /shopping-list
Update shopping list items

**Request:**
```json
{
  "item_id": 1,
  "is_purchased": true
}
```

---

## Stores

### GET /stores/nearby
Get nearby stores

**Query Parameters:**
- `latitude` (float)
- `longitude` (float)
- `radius` (number, km, default: 5)

**Response:** 200 OK
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Migros",
      "distance": 2.5,
      "latitude": 41.0082,
      "longitude": 28.9784,
      "address": "İstanbul, Turkey"
    }
  ]
}
```

### POST /stores/optimal-route
Calculate optimal shopping route

**Request:**
```json
{
  "store_ids": [1, 2, 3]
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "optimal_order": [1, 3, 2],
    "total_distance": 8.5,
    "estimated_time": 25
  }
}
```

---

## Prices

### POST /prices
Add price record

**Request:**
```json
{
  "product_id": 1,
  "store_id": 1,
  "price": 25.50
}
```

### GET /prices/history/:product_id
Get price history

**Response:** 200 OK
```json
{
  "success": true,
  "data": [
    {
      "store": "Migros",
      "price": 25.50,
      "date": "2024-01-20"
    }
  ]
}
```

### GET /prices/compare/:product_id
Compare prices across stores

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "cheapest_store": "Carrefour",
    "cheapest_price": 24.00,
    "stores": [
      { "name": "Migros", "price": 25.50 },
      { "name": "Carrefour", "price": 24.00 }
    ]
  }
}
```

---

## Analytics

### GET /analytics
Get analytics data

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "monthly_spending": 1250.50,
    "monthly_items": 45,
    "wastage_percentage": 12,
    "savings_potential": 180.00,
    "top_categories": [
      { "name": "Gıda", "amount": 650 }
    ],
    "top_expensive": [
      { "name": "Organize Kahve", "price": 45.50 }
    ]
  }
}
```

### GET /analytics/wastage
Get wastage analysis

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "wastage_items": [
      { "name": "Sebze", "count": 5 },
      { "name": "Süt", "count": 3 }
    ]
  }
}
```

---

## Housemates

### GET /household/members
Get household members

**Response:** 200 OK
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "owner"
    }
  ]
}
```

### POST /household/invite
Invite household member

**Request:**
```json
{
  "email": "friend@example.com"
}
```

**Response:** 201 Created
```json
{
  "success": true,
  "data": {
    "code": "INVITE123"
  }
}
```

### POST /household/accept-invite
Accept invitation

**Request:**
```json
{
  "invite_code": "INVITE123"
}
```

---

## Health Check

### GET /health
Check API health

**Response:** 200 OK
```json
{
  "status": "healthy",
  "service": "Akıllı Stok Takibi API"
}
```

---

## Error Responses

### Bad Request (400)
```json
{
  "success": false,
  "error": "Invalid input: email is required"
}
```

### Not Found (404)
```json
{
  "success": false,
  "error": "Product not found"
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": "Internal server error"
}
```
