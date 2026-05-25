````markdown name=README.md
# 🛒 Akıllı Stok Takip - Smart Home Inventory Tracker

Evinizdeki ürünleri otomatik takip eden, ne zaman biteceğini tahmin eden ve akıllı alışveriş listesi oluşturan mobil uygulama.

## 🎯 Ana Özellikler

### 1. 📱 Barkod Okuma
- Kamerayı ürüne tutarak otomatik ürün ekleme
- Ürün bilgilerini otomatik çekme (ad, kategori, resim)
- Barcode veritabanı entegrasyonu

### 2. ⏰ Akıllı Bitme Tahmini
- Kullanıcı tarafından belirtilen kullanım sıklığına göre hesaplama
- Real-time bildirimler
- Grafiklerde tahmin gösterimi

### 3. 📍 Konum Tabanlı Hatırlatmalar
- Markete yaklaşınca uyarı
- Alışveriş listesini otomatik gösterme
- Yakındaki marketleri bulma

### 4. 💰 Fiyat Takibi
- Ürün fiyatlarını kaydetme
- Market karşılaştırması
- Aylık harcama analizi
- Tasarruf önerileri

### 5. 👥 Ortak Ev Modu
- Ev arkadaşları ile liste paylaşma
- Kim ne aldı görme
- Ortak bütçe takibi
- Bildirim yönetimi

### 6. 📊 İsraf Analizi
- En çok çöpe giden ürünleri tespit etme
- Alışkanlık analizi
- Tasarruf önerileri

### 7. 🗺️ Akıllı Alışveriş Rotası
- En ucuz kombinasyon bulma
- En kısa rota hesaplama
- Multi-market karşılaştırması

## 🛠️ Teknoloji Stack

### Frontend (Mobile)
- **Expo** - React Native framework
- **Expo Camera** - Barkod okuma
- **Expo Location** - Konum servisleri
- **Expo Notifications** - Push bildirimler
- **TypeScript** - Type safety
- **Zustand** - State management
- **React Query** - Data fetching
- **Supabase** - Backend-as-a-service

### Backend
- **Rust + Actix-web** - High performance API
- **PostgreSQL** - Veritabanı
- **Redis** - Caching & real-time
- **JWT** - Authentication

### Infrastructure
- **Docker** - Containerization
- **Firebase Cloud Messaging** - Push notifications
- **Google Maps API** - Harita ve rota

## 📁 Proje Yapısı

```
akillistok/
├── frontend/                 # Expo Mobile App
│   ├── src/
│   │   ├── screens/         # Uygulama ekranları
│   │   ├── components/      # Reusable bileşenler
│   │   ├── api/             # API işlemleri
│   │   ├── store/           # Zustand state management
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Yardımcı fonksiyonlar
│   │   ├── services/        # İş mantığı servisleri
│   │   └── navigation/      # Navigasyon yapısı
│   ├── assets/              # Resimler, fontlar
│   ├── app.json             # Expo konfigürasyonu
│   └── package.json
│
├── backend/                 # Rust API
│   ├── src/
│   │   ├── main.rs
│   │   ├── models.rs        # Veri modelleri
│   │   ├── handlers.rs      # API handlers
│   │   ├── services.rs      # İş mantığı
│   │   ├── db.rs            # Veritabanı işlemleri
│   │   ├── auth.rs          # Kimlik doğrulama
│   │   └── errors.rs        # Error handling
│   ├── Cargo.toml
│   ├── .env.example
│   └── migrations/          # Database migrations
│
├── docs/                    # Dokumentasyon
│   ├── API_DOCS.md
│   ├── DATABASE_SCHEMA.md
│   ├── SETUP.md
│   └── ARCHITECTURE.md
│
├── docker-compose.yml       # Docker orchestration
├── .gitignore
└── README.md
```

## 🚀 Hızlı Başlangıç

### Ön Koşullar
- Node.js 18+
- Rust 1.70+
- PostgreSQL 14+
- Docker & Docker Compose (opsiyonel)

### 1. Frontend Kurulumu

```bash
cd frontend
npm install
npm start
```

### 2. Backend Kurulumu

```bash
cd backend
cp .env.example .env
cargo build
cargo run
```

### 3. Veritabanı Kurulumu

```bash
docker-compose up -d
# veya
psql -U postgres -f migrations/001_init.sql
```

## 📱 Ekranlar

- **Dashboard** - Hızlı görünüm, yakında bitecek ürünler
- **Ürün Listesi** - Tüm ürünleri gösterme
- **Ürün Ekleme** - Barkod veya manuel ekleme
- **Fiyat Takibi** - Market fiyatlarını karşılaştırma
- **Alışveriş Listesi** - Otomatik oluşturulan liste
- **İstatistikler** - Harcama analizi ve grafikler
- **Markete Git** - Konum ve rota haritası
- **Ayarlar** - Profil, bildirimler, ev arkadaşları

## 🔐 Güvenlik

- JWT token-based authentication
- SQLite encryption (offline mode)
- Supabase Row Level Security
- API rate limiting
- HTTPS only

## 📊 API Endpoints

Detaylı API dokümantasyonu için `docs/API_DOCS.md` dosyasına bakınız.

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
POST   /api/purchases
GET    /api/analytics
GET    /api/predictions
```

## 🤝 Ortak Çalışma

Ev arkadaşları eklemek ve liste paylaşmak:

```typescript
// Ev kodunu paylaş
const householdCode = await inviteHousemate('user@example.com');

// Ev arkadaşları
const mates = await getHousemateList();
```

## 📈 İstatistikler

Aylık harcama, en pahalı ürünler, tasarruf oranları ve daha fazlası:

```typescript
const analytics = await getMonthlyAnalytics();
const wastage = await getWastageAnalysis();
```

## 🐛 Katkıda Bulunma

1. Fork et
2. Feature branch oluştur (`git checkout -b feature/amazing`)
3. Commit et (`git commit -m 'Add amazing feature'`)
4. Push et (`git push origin feature/amazing`)
5. Pull Request aç

## 📝 Lisans

MIT License

## 📞 İletişim

- 📧 Email: info@akillistok.app
- 🐦 Twitter: @akillistok
- 💬 Discord: [Join our community](#)

---

**Evinizdeki Ürünleri Akıllı Bir Şekilde Takip Edin!** 🏠✨
````
