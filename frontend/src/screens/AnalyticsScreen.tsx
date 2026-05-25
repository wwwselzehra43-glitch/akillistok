import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

interface AnalyticsData {
  monthly_spending: number;
  monthly_items: number;
  wastage_percentage: number;
  savings_potential: number;
  top_categories: Array<{ name: string; amount: number }>;
  top_expensive: Array<{ name: string; price: number }>;
  spending_trend: number[];
  wastage_items: Array<{ name: string; count: number }>;
}

export const AnalyticsScreen = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await apiClient.getAnalytics();
      return response.data as AnalyticsData;
    },
  });

  if (isLoading || !analytics) {
    return (
      <View style={styles.centered}>
        <Text>Veriler yükleniyor...</Text>
      </View>
    );
  }

  const screenWidth = Dimensions.get('window').width - 32;

  const chartConfig = {
    backgroundGradientFrom: '#FFF',
    backgroundGradientTo: '#FFF',
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };

  const categoryChartData = {
    labels: analytics.top_categories.map((c) => c.name.slice(0, 8)),
    datasets: [
      {
        data: analytics.top_categories.map((c) => c.amount),
      },
    ],
  };

  const wastageChartData = {
    labels: analytics.wastage_items
      .slice(0, 5)
      .map((w) => w.name.slice(0, 8)),
    datasets: [
      {
        data: analytics.wastage_items.slice(0, 5).map((w) => w.count),
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>📊 İstatistikler</Text>

      {/* Summary Cards */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Aylık Harcama</Text>
          <Text style={styles.summaryValue}>
            ₺{analytics.monthly_spending.toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Aylık Ürün</Text>
          <Text style={styles.summaryValue}>{analytics.monthly_items}</Text>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, styles.warningCard]}>
          <Text style={styles.summaryLabel}>İsraf Oranı</Text>
          <Text style={styles.summaryValue}>
            {analytics.wastage_percentage}%
          </Text>
        </View>
        <View style={[styles.summaryCard, styles.successCard]}>
          <Text style={styles.summaryLabel}>Tasarruf Potansiyeli</Text>
          <Text style={styles.summaryValue}>
            ₺{analytics.savings_potential.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Kategori Dağılımı */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>💰 Kategori Başına Harcama</Text>
        <BarChart
          data={categoryChartData}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          fromZero
        />
      </View>

      {/* En Pahalı Ürünler */}
      <View style={styles.listContainer}>
        <Text style={styles.chartTitle}>💎 En Pahalı Ürünler</Text>
        {analytics.top_expensive.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>₺{item.price.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* İsraf Analizi */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>♻️ En Çok Çöpe Giden Ürünler</Text>
        <BarChart
          data={wastageChartData}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          fromZero
        />
      </View>

      {/* Öneriler */}
      <View style={styles.recommendationContainer}>
        <Text style={styles.chartTitle}>💡 Tasarruf Önerileri</Text>
        <View style={styles.recommendationCard}>
          <Text style={styles.recommendationText}>
            • Sebzelerinizi daha sık tüketin veya daha az satın alın
          </Text>
        </View>
        <View style={styles.recommendationCard}>
          <Text style={styles.recommendationText}>
            • Süt ürünleri sık bitiyor - daha küçük boy satın almayı deneyin
          </Text>
        </View>
        <View style={styles.recommendationCard}>
          <Text style={styles.recommendationText}>
            • {analytics.savings_potential}₺ tasarruf yapabilirsiniz
          </Text>
        </View>
      </View>

      {/* İndir Butonu */}
      <TouchableOpacity style={styles.downloadButton}>
        <Text style={styles.downloadButtonText}>📥 Raporu İndir</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingTop: 12,
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
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  warningCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  successCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  chartContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  listContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemName: {
    fontSize: 14,
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  recommendationContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendationCard: {
    backgroundColor: '#F5F5F5',
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
    padding: 12,
    marginTop: 8,
    borderRadius: 4,
  },
  recommendationText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
  downloadButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  downloadButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
