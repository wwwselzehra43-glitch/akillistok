import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { useStockStore } from '../store/stockStore';

interface DashboardItem {
  id: number;
  name: string;
  daysLeft: number;
  percentage: number;
  category: string;
  image?: string;
}

export const DashboardScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { setStocks } = useStockStore();

  const { data: items, isLoading, refetch } = useQuery({
    queryKey: ['dashboard-items'],
    queryFn: async () => {
      const response = await apiClient.getDashboardItems();
      return response.data as DashboardItem[];
    },
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderUrgentItem = ({ item }: { item: DashboardItem }) => {
    const isUrgent = item.daysLeft <= 3;
    const isWarning = item.daysLeft <= 7;

    return (
      <TouchableOpacity
        style={[
          styles.itemCard,
          isUrgent && styles.urgentCard,
          isWarning && styles.warningCard,
        ]}
      >
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text
            style={[
              styles.daysLeft,
              isUrgent && styles.urgentText,
              isWarning && styles.warningText,
            ]}
          >
            {item.daysLeft} gün
          </Text>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${item.percentage}%`,
                backgroundColor: isUrgent
                  ? '#FF4444'
                  : isWarning
                  ? '#FF9800'
                  : '#4CAF50',
              },
            ]}
          />
        </View>

        <Text style={styles.category}>{item.category}</Text>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = (title: string, count: number) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionCount}>{count}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  const urgentItems = items?.filter((i) => i.daysLeft <= 3) || [];
  const warningItems = items?.filter((i) => i.daysLeft > 3 && i.daysLeft <= 7) || [];
  const normalItems = items?.filter((i) => i.daysLeft > 7) || [];

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>📊 Dashboard</Text>

      <FlatList
        data={[
          { type: 'urgent', header: '🚨 ACİL', count: urgentItems.length, items: urgentItems },
          { type: 'warning', header: '⚠️ UYARI', count: warningItems.length, items: warningItems },
          { type: 'normal', header: '✅ NORMAL', count: normalItems.length, items: normalItems },
        ]}
        renderItem={({ item: section }) => (
          <>
            {section.count > 0 && (
              <>
                {renderSectionHeader(section.header, section.count)}
                <FlatList
                  data={section.items}
                  renderItem={renderUrgentItem}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                />
              </>
            )}
          </>
        )}
        keyExtractor={(item) => item.type}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
  },
  sectionCount: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    color: '#2196F3',
  },
  itemCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  urgentCard: {
    borderLeftColor: '#FF4444',
    backgroundColor: '#FFEBEE',
  },
  warningCard: {
    borderLeftColor: '#FF9800',
    backgroundColor: '#FFF3E0',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  daysLeft: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  urgentText: {
    color: '#FF4444',
  },
  warningText: {
    color: '#FF9800',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  category: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});
