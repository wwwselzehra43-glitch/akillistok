# Architecture - Akıllı Stok Takip

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobile App (Expo)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │  Barcode     │  │  Shopping    │      │
│  │  Analytics   │  │  Maps        │  │  List        │      │
│  │  Housemates  │  │  Prices      │  │  Notifications│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         ▼                   ▼                   ▼             │
│  ┌─────────────────────────────────────────────────┐        │
│  │         React Query (Data Fetching)             │        │
│  │         Zustand (State Management)              │        │
│  └──────────────────┬──────────────────────────────┘        │
└─────────────────────┼──────────────────────────────────────┘
                      │ HTTPS
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   Rust Backend (Actix-web)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Auth       │  │   Products   │  │  Analytics   │      │
│  │   Handlers   │  │   Handlers   │  │   Handlers   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         ▼                   ▼                   ▼             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Services   │  │   Services   │  │   Services   │      │
│  │   (Logic)    │  │   (Logic)    │  │   (Logic)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         ▼                   ▼                   ▼             │
│  ┌─────────────────────────────────────────────────┐        │
│  │        Database Layer (SQLx)                    │        │
│  └──────────────────┬──────────────────────────────┘        │
└─────────────────────┼──────────────────────────────────────┘
                      │
                      ▼
              ┌───────────────────┐
              │    PostgreSQL     │
              │   Database        │
              └───────────────────┘
```

## Frontend Architecture

### Folder Structure
```
frontend/
├── src/
│   ├── screens/              # Tab screens
│   │   ├── DashboardScreen.tsx
│   │   ├── BarcodeScreen.tsx
│   │   ├── ShoppingListScreen.tsx
│   │   ├── NearbyStoresScreen.tsx
│   │   ├── AnalyticsScreen.tsx
│   │   └── HousemateScreen.tsx
│   │
│   ├── components/           # Reusable components
│   │   ├── ProductCard.tsx
│   │   ├── StoreCard.tsx
│   │   └── AlertBanner.tsx
│   │
│   ├── api/
│   │   └── client.ts         # API client
│   │
│   ├── store/                # State management
│   │   ├── stockStore.ts
│   │   └── index.ts
│   │
│   ├── hooks/                # Custom hooks
│   │   ├── useLocation.ts
│   │   └── useNotifications.ts
│   │
│   ├── services/             # Business logic
│   │   ├── predictionService.ts
│   │   └── analyticsService.ts
│   │
│   └── navigation/
│       └── RootNavigator.tsx
│
├── App.tsx
├── app.json
├── package.json
└── tsconfig.json
```

### Data Flow

```
User Interaction
      ▼
React Component
      ▼
Zustand Store (state)
      ▼
useQuery/useMutation (React Query)
      ▼
API Client (axios)
      ▼
Backend API
      ▼
Update Component
```

## Backend Architecture

### Folder Structure
```
backend/
├── src/
│   ├── main.rs              # Entry point
│   ├── models.rs            # Data structures
│   ├── handlers.rs          # HTTP handlers
│   ├── services/
│   │   ├── product.rs
│   │   ├── analytics.rs
│   │   ├── prediction.rs
│   │   └── household.rs
│   ├── db.rs                # Database
│   ├── auth.rs              # Authentication
│   └── errors.rs            # Error handling
│
├── migrations/              # Database migrations
│   ├── 001_init.sql
│   ├── 002_add_tables.sql
│   └── 003_add_indexes.sql
│
├── Cargo.toml
├── .env.example
└── README.md
```

### Request Flow

```
HTTP Request
      ▼
Actix Middleware
      ▼
Router
      ▼
Handler
      ▼
Service Layer
      ▼
Database Layer
      ▼
PostgreSQL
      ▼
Response
```

## Key Features Architecture

### 1. Prediction Engine
```
Product + Usage Frequency
      ▼
Calculate Daily Usage
      ▼
Predict Stockout Date
      ▼
Compare with Current Quantity
      ▼
Generate Alert (Urgent/Warning/Normal)
```

### 2. Smart Shopping List
```
All Products
      ▼
Filter (Expiring Soon)
      ▼
Group by Category
      ▼
Sort by Proximity
      ▼
Generate List
```

### 3. Price Tracking
```
Product Purchase
      ▼
Record Price (Store)
      ▼
Compare with History
      ▼
Suggest Best Deal
      ▼
Calculate Savings
```

### 4. Analytics
```
Product Movements
      ▼
Calculate Spending
      ▼
Analyze Wastage
      ▼
Generate Reports
      ▼
Suggest Optimizations
```

## Database Schema

### Key Tables
- **users** - User accounts
- **households** - Shared households
- **household_members** - Members in households
- **products** - Inventory items
- **product_movements** - Usage history
- **shopping_lists** - Shopping lists
- **shopping_list_items** - List items
- **price_records** - Price history
- **stores** - Store locations
- **notifications** - User alerts

## Technologies Used

### Frontend
- **Expo** - React Native framework
- **React Navigation** - Routing
- **React Query** - Data fetching
- **Zustand** - State management
- **TypeScript** - Type safety
- **Axios** - HTTP client
- **Expo Camera** - Barcode scanning
- **Expo Location** - Geolocation
- **react-native-maps** - Mapping
- **react-native-chart-kit** - Charts

### Backend
- **Rust** - Programming language
- **Actix-web** - Web framework
- **PostgreSQL** - Database
- **SQLx** - SQL toolkit
- **JWT** - Authentication
- **Serde** - Serialization
- **Tokio** - Async runtime

## Security

### Frontend
- JWT token storage (secure)
- HTTPS only
- Input validation
- Error handling

### Backend
- Password hashing (bcrypt)
- JWT authentication
- SQL injection prevention (prepared statements)
- Rate limiting
- Input validation
- CORS configuration

## Performance Optimizations

### Frontend
- React Query caching
- Lazy loading screens
- Image compression
- Pagination
- Debouncing

### Backend
- Database indexing
- Connection pooling
- Query optimization
- Caching layer (Redis)
- Async operations

## Testing Strategy

### Frontend
- Unit tests (Jest)
- Component tests (React Testing Library)
- Integration tests

### Backend
- Unit tests (Rust test framework)
- Integration tests
- API tests

## Deployment

### Frontend
- Build with EAS
- Deploy to App Store / Play Store
- Updates via Expo

### Backend
- Containerized (Docker)
- Deploy to cloud (AWS, Heroku, DigitalOcean)
- Database backups

## Monitoring & Logging

- **Frontend**: Error tracking (Sentry)
- **Backend**: Structured logging (env_logger)
- **Database**: Query logs
- **Performance**: Metrics collection
