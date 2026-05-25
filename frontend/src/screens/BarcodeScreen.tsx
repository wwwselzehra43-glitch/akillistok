import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../api/client';

interface BarcodeScanResult {
  type: string;
  data: string;
}

export const BarcodeScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [productName, setProductName] = useState('');
  const [frequency, setFrequency] = useState('');
  const [price, setPrice] = useState('');

  const addProductMutation = useMutation({
    mutationFn: async (productData) => {
      return await apiClient.addProduct(productData);
    },
  });

  const handleBarcodeScan = (result: BarcodeScanResult) => {
    if (result?.data) {
      setScannedData(result.data);
      // Barkodu API'ye gönder ve ürün bilgisini al
      lookupBarcode(result.data);
    }
  };

  const lookupBarcode = async (barcode: string) => {
    try {
      const productData = await apiClient.lookupBarcode(barcode);
      setProductName(productData.name || '');
      setShowModal(true);
    } catch (error) {
      setShowModal(true);
      // Manual giriş için modal aç
    }
  };

  const handleAddProduct = async () => {
    if (!productName || !frequency) {
      alert('Lütfen tüm alanları doldurunuz');
      return;
    }

    addProductMutation.mutate({
      name: productName,
      barcode: scannedData,
      usageFrequency: frequency,
      price: price ? parseFloat(price) : null,
    });

    setShowModal(false);
    setProductName('');
    setFrequency('');
    setPrice('');
    setScannedData(null);
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Barkod okumak için kamera izni gerekli
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>İzin Ver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={handleBarcodeScan}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
        </View>
      </CameraView>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>📱 Ürünü kameraya tutunuz</Text>
        {scannedData && (
          <Text style={styles.scannedText}>Tarandı: {scannedData}</Text>
        )}
      </View>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ürün Bilgilerini Tamamla</Text>

            <Text style={styles.label}>Ürün Adı</Text>
            <TextInput
              style={styles.input}
              placeholder="Örn: Süt, Kahve, Şampuan"
              value={productName}
              onChangeText={setProductName}
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Kullanım Sıklığı</Text>
            <View style={styles.frequencyButtons}>
              {['Günde 1', 'Haftada 2', 'Haftada 1', 'Ayda 1', 'Ayda 2'].map(
                (freq) => (
                  <TouchableOpacity
                    key={freq}
                    style={[
                      styles.frequencyButton,
                      frequency === freq && styles.frequencyButtonActive,
                    ]}
                    onPress={() => setFrequency(freq)}
                  >
                    <Text
                      style={[
                        styles.frequencyButtonText,
                        frequency === freq &&
                          styles.frequencyButtonTextActive,
                      ]}
                    >
                      {freq}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>

            <Text style={styles.label}>Fiyat (İsteğe Bağlı)</Text>
            <TextInput
              style={styles.input}
              placeholder="₺0.00"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddProduct}
              disabled={addProductMutation.isPending}
            >
              {addProductMutation.isPending ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.addButtonText}>✅ Ürünü Ekle</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  infoBox: {
    backgroundColor: '#2196F3',
    padding: 16,
    alignItems: 'center',
  },
  infoText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scannedText: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 4,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
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
  frequencyButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    alignItems: 'center',
  },
  frequencyButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  frequencyButtonText: {
    fontSize: 12,
    color: '#333',
  },
  frequencyButtonTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});
