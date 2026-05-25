import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error('API Error:', error.message);
        return Promise.reject(error);
      }
    );
  }

  // === AUTH ENDPOINTS ===
  async register(email: string, password: string, name: string) {
    return this.client.post('/api/auth/register', { email, password, name });
  }

  async login(email: string, password: string) {
    return this.client.post('/api/auth/login', { email, password });
  }

  // === PRODUCT ENDPOINTS ===
  async getProducts() {
    return this.client.get('/api/products');
  }

  async getProduct(id: number) {
    return this.client.get(`/api/products/${id}`);
  }

  async addProduct(data: any) {
    return this.client.post('/api/products', data);
  }

  async updateProduct(id: number, data: any) {
    return this.client.put(`/api/products/${id}`, data);
  }

  async deleteProduct(id: number) {
    return this.client.delete(`/api/products/${id}`);
  }

  // === BARCODE ENDPOINTS ===
  async lookupBarcode(barcode: string) {
    return this.client.get(`/api/barcode/lookup/${barcode}`);
  }

  // === DASHBOARD ENDPOINTS ===
  async getDashboardItems() {
    return this.client.get('/api/dashboard/items');
  }

  // === LOCATION & STORES ===
  async getNearbyStores(latitude: number, longitude: number, radius: number = 5) {
    return this.client.get('/api/stores/nearby', {
      params: { latitude, longitude, radius },
    });
  }

  async getOptimalRoute(storeIds: number[]) {
    return this.client.post('/api/stores/optimal-route', { store_ids: storeIds });
  }

  // === ANALYTICS ===
  async getAnalytics() {
    return this.client.get('/api/analytics');
  }

  async getWastageAnalysis() {
    return this.client.get('/api/analytics/wastage');
  }

  async getSpendingTrend(months: number = 12) {
    return this.client.get('/api/analytics/spending-trend', {
      params: { months },
    });
  }

  // === SHOPPING LIST ===
  async getShoppingList() {
    return this.client.get('/api/shopping-list');
  }

  async updateShoppingList(data: any) {
    return this.client.put('/api/shopping-list', data);
  }

  async generateSmartList() {
    return this.client.post('/api/shopping-list/generate');
  }

  // === PRICE TRACKING ===
  async addPriceRecord(productId: number, storeId: number, price: number) {
    return this.client.post('/api/prices', { product_id: productId, store_id: storeId, price });
  }

  async getPriceHistory(productId: number) {
    return this.client.get(`/api/prices/history/${productId}`);
  }

  async comparePrices(productId: number) {
    return this.client.get(`/api/prices/compare/${productId}`);
  }

  // === PREDICTIONS ===
  async getPredictions() {
    return this.client.get('/api/predictions');
  }

  async predictProductStockout(productId: number) {
    return this.client.get(`/api/predictions/stockout/${productId}`);
  }

  // === HOUSEMATES ===
  async getHousemates() {
    return this.client.get('/api/household/members');
  }

  async inviteHousemate(email: string) {
    return this.client.post('/api/household/invite', { email });
  }

  async acceptInvite(inviteCode: string) {
    return this.client.post('/api/household/accept-invite', { invite_code: inviteCode });
  }

  // === NOTIFICATIONS ===
  async registerPushToken(token: string) {
    return this.client.post('/api/notifications/register-token', { token });
  }

  async getNotificationSettings() {
    return this.client.get('/api/notifications/settings');
  }

  async updateNotificationSettings(settings: any) {
    return this.client.put('/api/notifications/settings', settings);
  }

  // === HEALTH CHECK ===
  async healthCheck() {
    return this.client.get('/api/health');
  }
}

export const apiClient = new ApiClient();
