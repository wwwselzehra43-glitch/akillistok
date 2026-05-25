import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

interface NearbyStore {
  id: string;
  name: string;
  distance: number;
  latitude: number;
  longitude: number;
  address: string;
  items_available: number;
}

export const NearbyStoresScreen = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Konum izni verilmedi');
        return;
      }

      let loc = await Location.getCurrentLocationAsync({});
      setLocation(loc);
      setMapRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const { data: stores, isLoading } = useQuery({
    queryKey: ['nearby-stores', location?.coords],
    queryFn: async () => {
      if (!location) return [];
      const response = await apiClient.getNearbyStores(
        location.coords.latitude,
        location.coords.longitude
      );
      return response.data as NearbyStore[];
    },
    enabled: !!location,
  });

  const renderStoreCard = ({ item }: { item: NearbyStore }) => (
    <TouchableOpacity style={styles.storeCard}>
      <View>
        <Text style={styles.storeName}>{item.name}</Text>
        <Text style={styles.storeDistance}>
          📍 {item.distance.toFixed(1)} km
        </Text>
        <Text style={styles.storeAddress}>{item.address}</Text>
        <View style={styles.availabilityTag}>
          <Text style={styles.availabilityText}>
            ✅ {item.items_available} ürün mevcut
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.navigateButton}>
        <Text style={styles.navigateText}>🗺️ Rota</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>🏪 Yakındaki Marketler</Text>

      {mapRegion && (
        <MapView
          style={styles.map}
          region={mapRegion}
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Benim Konumum"
              description="Şu anda buradayım"
              pinColor="blue"
            />
          )}

          {stores?.map((store) => (
            <Marker
              key={store.id}
              coordinate={{
                latitude: store.latitude,
                longitude: store.longitude,
              }}
              title={store.name}
              description={`${store.distance.toFixed(1)} km`}
            />
          ))}
        </MapView>
      )}

      <FlatList
        data={stores}
        renderItem={renderStoreCard}
        keyExtractor={(item) => item.id}
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false}
      />

      <TouchableOpacity style={styles.optimalRouteButton}>
        <Text style={styles.optimalRouteText}>
          ⚡ En İyi Rotayı Hesapla
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#FFF',
    marginTop: 12,
  },
  map: {
    height: 250,
    margin: 16,
    borderRadius: 12,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  storeCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  storeDistance: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
    marginBottom: 4,
  },
  storeAddress: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  availabilityTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  availabilityText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  navigateButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  navigateText: {
    color: '#FFF',
    fontWeight: '600',
  },
  optimalRouteButton: {
    backgroundColor: '#2196F3',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  optimalRouteText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: '#FF4444',
  },
});
