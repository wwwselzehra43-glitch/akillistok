import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

interface Housemate {
  id: string;
  name: string;
  email: string;
  joined_at: string;
  role: 'owner' | 'member';
}

export const HousemateScreen = () => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [householdCode, setHouseholdCode] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const { data: housemates, isLoading, refetch } = useQuery({
    queryKey: ['housemates'],
    queryFn: async () => {
      const response = await apiClient.getHousemates();
      return response.data as Housemate[];
    },
  });

  const inviteMutation = useMutation({
    mutationFn: async (email: string) => {
      return await apiClient.inviteHousemate(email);
    },
    onSuccess: (data) => {
      setHouseholdCode(data.code);
      setInviteEmail('');
      refetch();
    },
  });

  const handleInvite = () => {
    if (!inviteEmail) {
      alert('Email adresini giriniz');
      return;
    }
    inviteMutation.mutate(inviteEmail);
  };

  const renderHousemate = ({ item }: { item: Housemate }) => (
    <View style={styles.housemateCard}>
      <View style={styles.housemateInfo}>
        <Text style={styles.housemate Name}>{item.name}</Text>
        <Text style={styles.housemateEmail}>{item.email}</Text>
        <Text style={styles.housemateDate}>
          Katıldı: {new Date(item.joined_at).toLocaleDateString('tr-TR')}
        </Text>
      </View>
      <View style={styles.roleTag}>
        <Text style={styles.roleText}>
          {item.role === 'owner' ? '👑 Sahibi' : '👤 Üye'}
        </Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>👥 Ev Arkadaşları</Text>

      {/* Household Info */}
      <View style={styles.householdInfoCard}>
        <Text style={styles.infoLabel}>Ev Kodu:</Text>
        <View style={styles.codeBox}>
          <Text style={styles.codeText}>{householdCode || 'XXXXX'}</Text>
          <TouchableOpacity style={styles.copyButton}>
            <Text style={styles.copyButtonText}>📋 Kopyala</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Settings */}
      <View style={styles.settingsCard}>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Ortak Liste Bildirimleri</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </View>
      </View>

      {/* Housemates List */}
      <Text style={styles.sectionTitle}>
        Üyeler ({housemates?.length || 0})
      </Text>

      <FlatList
        data={housemates}
        renderItem={renderHousemate}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />

      {/* Invite Button */}
      <TouchableOpacity
        style={styles.inviteButton}
        onPress={() => setShowInviteModal(true)}
      >
        <Text style={styles.inviteButtonText}>➕ Davet Gönder</Text>
      </TouchableOpacity>

      {/* Invite Modal */}
      <Modal visible={showInviteModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ev Arkadaşı Davet Et</Text>

            <Text style={styles.label}>Email Adresi</Text>
            <TextInput
              style={styles.input}
              placeholder="ornek@email.com"
              value={inviteEmail}
              onChangeText={setInviteEmail}
              keyboardType="email-address"
              placeholderTextColor="#999"
            />

            <Text style={styles.helperText}>
              Davet aldıkları zaman otomatik olarak liste'ye erişebilecekler.
            </Text>

            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleInvite}
              disabled={inviteMutation.isPending}
            >
              {inviteMutation.isPending ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.sendButtonText}>✉️ Davet Gönder</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowInviteModal(false)}
            >
              <Text style={styles.closeButtonText}>İptal</Text>
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
  householdInfoCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
    fontWeight: '600',
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  codeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    flex: 1,
    letterSpacing: 2,
  },
  copyButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  copyButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  settingsCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  listContent: {
    marginBottom: 16,
  },
  housemateCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  housemateInfo: {
    flex: 1,
  },
  housemate Name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  housemateEmail: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  housemateDate: {
    fontSize: 11,
    color: '#BBB',
  },
  roleTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196F3',
  },
  inviteButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  inviteButtonText: {
    color: '#FFF',
    fontSize: 16,
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
  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
  sendButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});
