import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useSync } from '../context/SyncContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { isSyncing, lastSyncTime, performFullSync, performIncrementalSync } = useSync();
  const [stats, setStats] = useState({
    sessions: 0,
    journalEntries: 0,
    albums: 0,
    progress: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const sessions = await AsyncStorage.getItem('trainingSessions');
      const journal = await AsyncStorage.getItem('journalEntries');
      const albums = await AsyncStorage.getItem('photoAlbums');
      const progress = await AsyncStorage.getItem('trainingProgress');

      setStats({
        sessions: sessions ? JSON.parse(sessions).length : 0,
        journalEntries: journal ? JSON.parse(journal).length : 0,
        albums: albums ? JSON.parse(albums).length : 0,
        progress: progress ? JSON.parse(progress).filter(p => p.completed).length : 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSync = async () => {
    setRefreshing(true);
    const result = await (lastSyncTime ? performIncrementalSync() : performFullSync());
    setRefreshing(false);

    if (result.success) {
      Alert.alert('Success', 'Data synced successfully');
      loadStats();
    } else {
      Alert.alert('Sync Failed', result.error || 'Could not sync data');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleSync} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back, {user?.username}! 👋</Text>
          <Text style={styles.subtext}>Training Gypsy for Service Work</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Sync Status */}
      <View style={styles.syncCard}>
        <View style={styles.syncHeader}>
          <Ionicons
            name={isSyncing ? 'sync' : 'cloud-done'}
            size={24}
            color={isSyncing ? '#2d5a4a' : '#4a7c9e'}
          />
          <Text style={styles.syncTitle}>
            {isSyncing ? 'Syncing...' : 'Synced'}
          </Text>
        </View>
        <Text style={styles.syncTime}>
          {lastSyncTime
            ? `Last synced: ${lastSyncTime.toLocaleString()}`
            : 'Never synced - Pull to sync'}
        </Text>
        <TouchableOpacity
          style={styles.syncButton}
          onPress={handleSync}
          disabled={isSyncing}
        >
          <Text style={styles.syncButtonText}>
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: '#2d5a4a' }]}>
          <Ionicons name="fitness" size={32} color="#fff" />
          <Text style={styles.statNumber}>{stats.sessions}</Text>
          <Text style={styles.statLabel}>Training Sessions</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#4a7c9e' }]}>
          <Ionicons name="checkmark-circle" size={32} color="#fff" />
          <Text style={styles.statNumber}>{stats.progress}</Text>
          <Text style={styles.statLabel}>Skills Mastered</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#d97642' }]}>
          <Ionicons name="book" size={32} color="#fff" />
          <Text style={styles.statNumber}>{stats.journalEntries}</Text>
          <Text style={styles.statLabel}>Journal Entries</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#c9a961' }]}>
          <Ionicons name="camera" size={32} color="#fff" />
          <Text style={styles.statNumber}>{stats.albums}</Text>
          <Text style={styles.statLabel}>Photo Albums</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Training')}
        >
          <Ionicons name="fitness" size={24} color="#2d5a4a" />
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Log Training Session</Text>
            <Text style={styles.actionDesc}>Record today's training progress</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Journal')}
        >
          <Ionicons name="create" size={24} color="#4a7c9e" />
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>New Journal Entry</Text>
            <Text style={styles.actionDesc}>Document your thoughts and progress</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Photos')}
        >
          <Ionicons name="camera" size={24} color="#d97642" />
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Add Photos</Text>
            <Text style={styles.actionDesc}>Capture training moments</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>🇺🇸 Semper Fidelis</Text>
        <Text style={styles.footerText}>Gypsy Training v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1a3a2e',
    padding: 20,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtext: {
    fontSize: 14,
    color: '#b8cdc7',
    marginTop: 5,
  },
  syncCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  syncHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  syncTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  syncTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  syncButton: {
    backgroundColor: '#2d5a4a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  syncButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  statCard: {
    width: '47%',
    margin: '1.5%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
    textAlign: 'center',
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  actionCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionContent: {
    flex: 1,
    marginLeft: 15,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  actionDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginVertical: 3,
  },
});
