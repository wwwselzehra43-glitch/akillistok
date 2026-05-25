# Akıllı Stok Takip - Setup Kılavuzu

## Gereksinimler

- **Node.js**: 18+ 
- **Rust**: 1.70+
- **PostgreSQL**: 14+
- **Expo CLI**: `npm install -g expo-cli`

## 1. Frontend Kurulumu

### Step 1: Bağımlılıkları Yükle
```bash
cd frontend
npm install
```

### Step 2: Expo Yapılandırması
```bash
# app.json'da gerekli değişiklikleri yap
# EXPO_PUBLIC_API_URL'yi ayarla
```

### Step 3: Geliştirme Sunucusunu Başlat
```bash
npm start

# Seçenekler:
# a - Android Emulator
# i - iOS Simulator
# w - Web
```

## 2. Backend Kurulumu

### Step 1: Ortam Değişkenlerini Ayarla
```bash
cd backend
cp .env.example .env

# .env dosyasını düzenle:
DATABASE_URL=postgresql://user:password@localhost:5432/akillistok
RUST_LOG=info
PORT=8000
HOST=0.0.0.0
```

### Step 2: Veritabanı Oluştur
```bash
# PostgreSQL ile veritabanı oluştur
createdb akillistok

# ya da psql'den:
psql -U postgres
CREATE DATABASE akillistok;
```

### Step 3: Rust Projesini Derle
```bash
cargo build --release
```

### Step 4: Sunucuyu Başlat
```bash
cargo run

# ya da release modunda:
cargo run --release
```

## 3. Veritabanı Migrasyonları

```bash
# Migration dosyalarını çalıştır
# docs/DATABASE_SCHEMA.md'deki SQL'i çalıştır

# PostgreSQL'de:
psql -U postgres -d akillistok -f migrations/001_init.sql
```

## 4. Docker ile Kurulum (Opsiyonel)

```bash
# PostgreSQL ve pgAdmin başlat
docker-compose up -d

# pgAdmin: http://localhost:5050
# PostgreSQL: localhost:5432
```

## 5. API Testi

```bash
# Health check
curl http://localhost:8000/api/health

# Ürün listesi (henüz boş)
curl http://localhost:8000/api/products
```

## 6. Önemli Dosyalar

### Frontend
- `frontend/App.tsx` - Ana entry point
- `frontend/src/navigation/RootNavigator.tsx` - Tab navigation
- `frontend/src/screens/` - Tüm ekranlar
- `frontend/src/api/client.ts` - API istemcisi
- `frontend/src/store/` - State management

### Backend
- `backend/src/main.rs` - Server entry point
- `backend/src/handlers.rs` - API endpoints
- `backend/src/db.rs` - Database operations
- `backend/Cargo.toml` - Bağımlılıklar

## 7. Mobil Cihazda Test Etme

### iOS (Mac only)
```bash
cd frontend
npm run ios
```

### Android
```bash
cd frontend
npm run android
```

### Expo Go App ile
```bash
# Sunucuyu başlat
npm start

# QR kod'u Expo Go uygulaması ile tara
```

## 8. Sorun Giderme

### Port Already in Use (8000)
```bash
# Başka bir port kullan
cargo run -- --port 8001
```

### PostgreSQL Bağlantı Hatası
```bash
# PostgreSQL servisini kontrol et
# macOS:
brew services start postgresql

# Linux:
sudo systemctl start postgresql

# Windows:
net start postgresql-x64-14
```

### Node Modules Sorunları
```bash
rm -rf node_modules package-lock.json
npm install
```

## 9. Production Build

### Frontend
```bash
cd frontend
eas build --platform ios
eas build --platform android
```

### Backend
```bash
cd backend
cargo build --release
# Binary: target/release/akillistok-api
```

## 10. Environment Değişkenleri

### Frontend (.env)
```
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_GOOGLE_MAPS_KEY=YOUR_KEY
```

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/akillistok
RUST_LOG=info
PORT=8000
HOST=0.0.0.0
JWT_SECRET=your_secret_key
FIREBASE_API_KEY=your_firebase_key
```

## 11. Faydalı Linkler

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Rust Guide](https://doc.rust-lang.org/book/)
- [Actix Web](https://actix.rs/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
