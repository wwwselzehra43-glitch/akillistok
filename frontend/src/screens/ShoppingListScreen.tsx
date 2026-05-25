import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  CheckBox,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

interface ShoppingItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  is_purchased: boolean;
  estimated_price: number;
  category: string;
}

interface ShoppingList {
  id: number;
  name: string;
  total_items: number;
  purchased_items: number;
  estimated_total: number;
  items: ShoppingItem[];
}

export const ShoppingListScreen = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');

  const { data: list, isLoading, refetch } = useQuery({
    queryKey: ['shopping-list'],
    queryFn: async () => {
      const response = await apiClient.getShoppingList();
      return response.data as ShoppingList;
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async (itemData) => {
      return await apiClient.updateShoppingList(itemData);
    },
    onSuccess: () => {
      refetch();
    },
  });

  const generateSmartListMutation = useMutation({
    mutationFn: async () => {
      return await apiClient.generateSmartList();
    },
    onSuccess: () => {
      refetch();
    },
  });

  const handleToggleItem = (itemId: number, currentStatus: boolean) => {
    updateItemMutation.mutate({
      item_id: itemId,
      is_purchased: !currentStatus,
    });
  };

  const handleAddItem = () => {
    if (!newItemName || !newItemQuantity) {
      alert('Lütfen ürün adı ve miktarını giriniz');
      return;
    }

    updateItemMutation.mutate({
      action: 'add',
      product_name: newItemName,
      quantity: parseFloat(newItemQuantity),
    });

    setNewItemName('');
    setNewItemQuantity('1');
    setShowAddModal(false);
  };

  const renderListItem = ({ item }: { item: ShoppingItem }) => (
    <TouchableOpacity
      style={[
        styles.listItem,
        item.is_purchased && styles.listItemPurchased,
      ]}
      onPress={() => handleToggleItem(item.id, item.is_purchased)}
    >
      <View style={styles.itemLeft}>
        <View
          style={[
            styles.checkbox,
            item.is_purchased && styles.checkboxChecked,
          ]}
        >
          {item.is_purchased && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>
        <View style={styles.itemInfo}>
          <Text
            style={[
              styles.itemName,
              item.is_purchased && styles.itemNamePurchased,
            ]}
          >
            {item.product_name}
          </Text>
          <Text style={styles.itemMeta}>
            {item.quantity} adet • {item.category}
          </Text>
        </View>
      </View>
      <Text style={styles.itemPrice}>₺{item.estimated_price.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  const unpurchasedItems = list?.items.filter((i) => !i.is_purchased) || [];
  const purchasedItems = list?.items.filter((i) => i.is_purchased) || [];
  const unpurchasedTotal = unpurchasedItems.reduce(
    (sum, item) => sum + item.estimated_price,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>🛒 Alışveriş Listesi</Text>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryLeft}>
          <Text style={styles.summaryLabel}>Toplam Tahmini Fiyat</Text>
          <Text style={styles.summaryPrice}>
            ₺{unpurchasedTotal.toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryRight}>
          <Text style={styles.progressText}>
            {purchasedItems.length}/{list?.total_items}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((purchasedItems.length / (list?.total_items || 1)) * 100)}%`,
                },
              ]}
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Purchased Items Section */}
        {purchasedItems.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              ✅ Satın Alınan ({purchasedItems.length})
            </Text>
            <FlatList
              data={purchasedItems}
              renderItem={renderListItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </>
        )}

        {/* Unpurchased Items Section */}
        {unpurchasedItems.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              📋 Satın Alınacaklar ({unpurchasedItems.length})
            </Text>
            <FlatList
              data={unpurchasedItems}
              renderItem={renderListItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </>
        )}

        {unpurchasedItems.length === 0 && purchasedItems.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              📭 Alışveriş listesi boş
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Yeni ürün ekleyin veya akıllı listeyi oluşturun
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.smartListButton}
          onPress={() => generateSmartListMutation.mutate()}
          disabled={generateSmartListMutation.isPending}
        >
          {generateSmartListMutation.isPending ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>⚡ Akıllı Liste Oluştur</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.buttonText}>➕ Ürün Ekle</Text>
        </TouchableOpacity>
      </View>

      {/* Add Item Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Yeni Ürün Ekle</Text>

            <Text style={styles.label}>Ürün Adı</Text>
            <TextInput
              style={styles.input}
              placeholder="Örn: Süt, Ekmek, Kahve"
              value={newItemName}
              onChangeText={setNewItemName}
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Miktar</Text>
            <TextInput
              style={styles.input}
              placeholder="1"
              value={newItemQuantity}
              onChangeText={setNewItemQuantity}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={styles.addModalButton}
              onPress={handleAddItem}
              disabled={updateItemMutation.isPending}
            >
              {updateItemMutation.isPending ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.addModalButtonText}>✅ Ekle</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontSize: 28,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    color: '#333',
  },
  summaryCard: {
    backgroundColor: '#2196F3',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryLeft: {
    flex: 1,
  },
  summaryRight: {
    flex: 1,
    marginLeft: 16,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#FFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  summaryPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  progressText: {
    fontSize: 12,
    color: '#FFF',
    marginBottom: 4,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
  },
  listItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemPurchased: {
    backgroundColor: '#F0F0F0',
  },
  itemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#DDD',
    borderRadius: 6,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkmark: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  itemNamePurchased: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  itemMeta: {
    fontSize: 12,
    color: '#999',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#BBB',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  smartListButton: {
    flex: 1,
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  addModalButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  addModalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});
